package handlers

import (
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/lib/pq"

	"moalemplus/internal/models"
)

type AttendanceHandler struct {
	db *sql.DB
}

func NewAttendanceHandler(db *sql.DB) *AttendanceHandler {
	return &AttendanceHandler{db: db}
}

// CreateAttendance creates attendance records for a class
func (h *AttendanceHandler) CreateAttendance(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	
	var req models.CreateAttendanceRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}
	
	// Check if class exists and belongs to user
	var existingClass models.Class
	checkQuery := `SELECT id FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = true`
	err := h.db.QueryRow(checkQuery, req.ClassID, userID).Scan(&existingClass.ID)
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Class not found",
		})
	}
	
	// Parse date
	attendanceDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid date format (YYYY-MM-DD)",
		})
	}
	
	// Check if attendance already exists for this date
	var existingCount int
	checkAttendanceQuery := `SELECT COUNT(*) FROM attendance WHERE class_id = $1 AND date = $2`
	err = h.db.QueryRow(checkAttendanceQuery, req.ClassID, attendanceDate).Scan(&existingCount)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to check existing attendance",
		})
	}
	
	if existingCount > 0 {
		return c.Status(409).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Attendance already recorded for this date",
		})
	}
	
	// Begin transaction
	tx, err := h.db.Begin()
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to begin transaction",
		})
	}
	
	// Insert attendance records
	insertQuery := `
		INSERT INTO attendance (id, student_id, class_id, date, status, notes, recorded_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	
	var attendanceIDs []uuid.UUID
	for _, record := range req.Records {
		attendanceID := uuid.New()
		attendanceIDs = append(attendanceIDs, attendanceID)
		
		var notes *string
		if record.Notes != "" {
			notes = &record.Notes
		}
		
		_, err = tx.Exec(insertQuery, attendanceID, record.StudentID, req.ClassID, attendanceDate, record.Status, notes, userID)
		if err != nil {
			tx.Rollback()
			if pqErr, ok := err.(*pq.Error); ok {
				if pqErr.Code == "23505" { // unique violation
					return c.Status(409).JSON(models.ErrorResponse{
						Error:   true,
						Message: "Attendance already recorded for one or more students",
					})
				}
			}
			return c.Status(500).JSON(models.ErrorResponse{
				Error:   true,
				Message: "Failed to create attendance records",
			})
		}
	}
	
	// Commit transaction
	err = tx.Commit()
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to commit attendance records",
		})
	}
	
	return c.Status(201).JSON(models.SuccessResponse{
		Success: true,
		Message: "Attendance recorded successfully",
		Data: fiber.Map{
			"attendance_ids": attendanceIDs,
			"date":          attendanceDate,
			"records_count": len(req.Records),
		},
	})
}

// GetClassAttendance retrieves attendance records for a class on a specific date
func (h *AttendanceHandler) GetClassAttendance(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	classID := c.Params("id")
	dateStr := c.Params("date")
	
	classUUID, err := uuid.Parse(classID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid class ID",
		})
	}
	
	// Check if class exists and belongs to user
	var existingClass models.Class
	checkQuery := `SELECT id FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = true`
	err = h.db.QueryRow(checkQuery, classUUID, userID).Scan(&existingClass.ID)
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Class not found",
		})
	}
	
	// Parse date
	attendanceDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid date format (YYYY-MM-DD)",
		})
	}
	
	// Get attendance records
	query := `
		SELECT 
			a.id, a.student_id, a.class_id, a.date, a.status, a.notes, 
			a.recorded_by, a.recorded_at, a.created_at, a.updated_at,
			s.first_name || ' ' || s.last_name as student_name,
			s.student_number
		FROM attendance a
		JOIN students s ON a.student_id = s.id
		WHERE a.class_id = $1 AND a.date = $2
		ORDER BY s.student_number
	`
	
	rows, err := h.db.Query(query, classUUID, attendanceDate)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch attendance records",
		})
	}
	defer rows.Close()
	
	var attendanceRecords []models.Attendance
	for rows.Next() {
		var attendance models.Attendance
		err := rows.Scan(
			&attendance.ID, &attendance.StudentID, &attendance.ClassID,
			&attendance.Date, &attendance.Status, &attendance.Notes,
			&attendance.RecordedBy, &attendance.RecordedAt, &attendance.CreatedAt,
			&attendance.UpdatedAt, &attendance.StudentName, &attendance.StudentNumber,
		)
		if err != nil {
			continue
		}
		attendanceRecords = append(attendanceRecords, attendance)
	}
	
	return c.JSON(attendanceRecords)
}

// UpdateAttendance updates an attendance record
func (h *AttendanceHandler) UpdateAttendance(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	attendanceID := c.Params("id")
	
	attendanceUUID, err := uuid.Parse(attendanceID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid attendance ID",
		})
	}
	
	// Check if attendance exists and belongs to user's class
	var existingAttendance models.Attendance
	checkQuery := `
		SELECT a.id FROM attendance a
		JOIN classes c ON a.class_id = c.id
		WHERE a.id = $1 AND c.teacher_id = $2
	`
	err = h.db.QueryRow(checkQuery, attendanceUUID, userID).Scan(&existingAttendance.ID)
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Attendance record not found",
		})
	}
	
	var req struct {
		Status string `json:"status" validate:"required,oneof=present absent late excused"`
		Notes  string `json:"notes,omitempty"`
	}
	
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}
	
	// Update the attendance record
	updateQuery := `
		UPDATE attendance 
		SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
		WHERE id = $3
		RETURNING updated_at
	`
	
	var notes *string
	if req.Notes != "" {
		notes = &req.Notes
	}
	
	var updatedAt time.Time
	err = h.db.QueryRow(updateQuery, req.Status, notes, attendanceUUID).Scan(&updatedAt)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to update attendance",
		})
	}
	
	return c.JSON(models.SuccessResponse{
		Success: true,
		Message: "Attendance updated successfully",
		Data: fiber.Map{
			"updated_at": updatedAt,
		},
	})
}

// GetStudentAttendanceReport retrieves attendance report for a student
func (h *AttendanceHandler) GetStudentAttendanceReport(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	studentID := c.Params("id")
	
	studentUUID, err := uuid.Parse(studentID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid student ID",
		})
	}
	
	// Check if student exists and belongs to user's class
	var existingStudent models.Student
	checkQuery := `
		SELECT s.id FROM students s
		JOIN classes c ON s.class_id = c.id
		WHERE s.id = $1 AND c.teacher_id = $2 AND s.is_active = true
	`
	err = h.db.QueryRow(checkQuery, studentUUID, userID).Scan(&existingStudent.ID)
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Student not found",
		})
	}
	
	// Get date range from query parameters
	startDate := c.Query("start_date", time.Now().AddDate(0, -1, 0).Format("2006-01-02"))
	endDate := c.Query("end_date", time.Now().Format("2006-01-02"))
	
	startDateTime, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid start_date format (YYYY-MM-DD)",
		})
	}
	
	endDateTime, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid end_date format (YYYY-MM-DD)",
		})
	}
	
	// Get attendance statistics
	statsQuery := `
		SELECT 
			COUNT(*) as total_days,
			COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
			COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
			COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
			COUNT(CASE WHEN status = 'excused' THEN 1 END) as excused_days
		FROM attendance
		WHERE student_id = $1 AND date BETWEEN $2 AND $3
	`
	
	var stats models.AttendanceStats
	err = h.db.QueryRow(statsQuery, studentUUID, startDateTime, endDateTime).Scan(
		&stats.TotalDays, &stats.PresentDays, &stats.AbsentDays, 
		&stats.LateDays, &stats.ExcusedDays,
	)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch attendance statistics",
		})
	}
	
	// Calculate attendance rate
	if stats.TotalDays > 0 {
		stats.AttendanceRate = float64(stats.PresentDays) / float64(stats.TotalDays) * 100
	}
	
	// Get detailed attendance records
	recordsQuery := `
		SELECT 
			a.id, a.student_id, a.class_id, a.date, a.status, a.notes, 
			a.recorded_by, a.recorded_at, a.created_at, a.updated_at
		FROM attendance a
		WHERE a.student_id = $1 AND a.date BETWEEN $2 AND $3
		ORDER BY a.date DESC
	`
	
	rows, err := h.db.Query(recordsQuery, studentUUID, startDateTime, endDateTime)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch attendance records",
		})
	}
	defer rows.Close()
	
	var attendanceRecords []models.Attendance
	for rows.Next() {
		var attendance models.Attendance
		err := rows.Scan(
			&attendance.ID, &attendance.StudentID, &attendance.ClassID,
			&attendance.Date, &attendance.Status, &attendance.Notes,
			&attendance.RecordedBy, &attendance.RecordedAt, &attendance.CreatedAt,
			&attendance.UpdatedAt,
		)
		if err != nil {
			continue
		}
		attendanceRecords = append(attendanceRecords, attendance)
	}
	
	report := models.AttendanceReport{
		Date:        time.Now(),
		Attendances: attendanceRecords,
		Stats:       stats,
	}
	
	return c.JSON(report)
}