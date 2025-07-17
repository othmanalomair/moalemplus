package handlers

import (
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/lib/pq"

	"moalemplus/internal/models"
)

type StudentHandler struct {
	db *sql.DB
}

func NewStudentHandler(db *sql.DB) *StudentHandler {
	return &StudentHandler{db: db}
}

// GetClassStudents retrieves all students for a specific class
func (h *StudentHandler) GetClassStudents(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	classID := c.Params("id")
	
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
	
	// Get students with attendance rate
	query := `
		SELECT 
			s.id, s.student_number, s.civil_id, s.first_name, s.last_name, 
			s.arabic_name, s.date_of_birth, s.gender, s.nationality, s.address,
			s.class_id, s.enrollment_date, s.is_active, s.created_at, s.updated_at,
			COALESCE(attendance_rates.rate, 0) as attendance_rate
		FROM students s
		LEFT JOIN (
			SELECT 
				student_id,
				COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*) as rate
			FROM attendance 
			WHERE class_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'
			GROUP BY student_id
		) attendance_rates ON s.id = attendance_rates.student_id
		WHERE s.class_id = $1 AND s.is_active = true
		ORDER BY s.student_number
	`
	
	rows, err := h.db.Query(query, classUUID)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch students",
		})
	}
	defer rows.Close()
	
	var students []models.Student
	for rows.Next() {
		var student models.Student
		err := rows.Scan(
			&student.ID, &student.StudentNumber, &student.CivilID, 
			&student.FirstName, &student.LastName, &student.ArabicName,
			&student.DateOfBirth, &student.Gender, &student.Nationality,
			&student.Address, &student.ClassID, &student.EnrollmentDate,
			&student.IsActive, &student.CreatedAt, &student.UpdatedAt,
			&student.AttendanceRate,
		)
		if err != nil {
			continue
		}
		students = append(students, student)
	}
	
	return c.JSON(students)
}

// CreateStudent creates a new student in a class
func (h *StudentHandler) CreateStudent(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	classID := c.Params("id")
	
	classUUID, err := uuid.Parse(classID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid class ID",
		})
	}
	
	// Check if class exists and belongs to user
	var existingClass models.Class
	checkQuery := `SELECT id, max_students FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = true`
	err = h.db.QueryRow(checkQuery, classUUID, userID).Scan(&existingClass.ID, &existingClass.MaxStudents)
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Class not found",
		})
	}
	
	// Check if class is full
	var currentStudentCount int
	countQuery := `SELECT COUNT(*) FROM students WHERE class_id = $1 AND is_active = true`
	err = h.db.QueryRow(countQuery, classUUID).Scan(&currentStudentCount)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to check class capacity",
		})
	}
	
	if currentStudentCount >= existingClass.MaxStudents {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Class is full",
		})
	}
	
	var req models.CreateStudentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}
	
	// Parse date of birth
	dateOfBirth, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid date of birth format (YYYY-MM-DD)",
		})
	}
	
	// Check if student number already exists
	var existingID uuid.UUID
	checkStudentQuery := `SELECT id FROM students WHERE student_number = $1 AND is_active = true`
	err = h.db.QueryRow(checkStudentQuery, req.StudentNumber).Scan(&existingID)
	if err == nil {
		return c.Status(409).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Student number already exists",
		})
	}
	
	// Create the student
	studentID := uuid.New()
	insertQuery := `
		INSERT INTO students (id, student_number, civil_id, first_name, last_name, 
		                     arabic_name, date_of_birth, gender, nationality, address, class_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING enrollment_date, created_at, updated_at
	`
	
	var civilID *string
	if req.CivilID != "" {
		civilID = &req.CivilID
	}
	
	var address *string
	if req.Address != "" {
		address = &req.Address
	}
	
	var enrollmentDate, createdAt, updatedAt time.Time
	err = h.db.QueryRow(insertQuery, studentID, req.StudentNumber, civilID, req.FirstName, req.LastName, req.ArabicName, dateOfBirth, req.Gender, req.Nationality, address, classUUID).Scan(&enrollmentDate, &createdAt, &updatedAt)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" { // unique violation
				return c.Status(409).JSON(models.ErrorResponse{
					Error:   true,
					Message: "Student with this information already exists",
				})
			}
		}
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to create student",
		})
	}
	
	student := models.Student{
		ID:             studentID,
		StudentNumber:  req.StudentNumber,
		CivilID:        civilID,
		FirstName:      req.FirstName,
		LastName:       req.LastName,
		ArabicName:     req.ArabicName,
		DateOfBirth:    dateOfBirth,
		Gender:         req.Gender,
		Nationality:    req.Nationality,
		Address:        address,
		ClassID:        classUUID,
		EnrollmentDate: enrollmentDate,
		IsActive:       true,
		CreatedAt:      createdAt,
		UpdatedAt:      updatedAt,
	}
	
	return c.Status(201).JSON(student)
}

// UpdateStudent updates an existing student
func (h *StudentHandler) UpdateStudent(c *fiber.Ctx) error {
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
		SELECT s.id, s.class_id FROM students s
		JOIN classes c ON s.class_id = c.id
		WHERE s.id = $1 AND c.teacher_id = $2 AND s.is_active = true
	`
	err = h.db.QueryRow(checkQuery, studentUUID, userID).Scan(&existingStudent.ID, &existingStudent.ClassID)
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Student not found",
		})
	}
	
	var req models.UpdateStudentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}
	
	// Parse date of birth
	dateOfBirth, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid date of birth format (YYYY-MM-DD)",
		})
	}
	
	// Update the student
	updateQuery := `
		UPDATE students 
		SET student_number = $1, civil_id = $2, first_name = $3, last_name = $4, 
		    arabic_name = $5, date_of_birth = $6, gender = $7, nationality = $8, 
		    address = $9, is_active = $10, updated_at = CURRENT_TIMESTAMP
		WHERE id = $11
		RETURNING updated_at
	`
	
	var civilID *string
	if req.CivilID != "" {
		civilID = &req.CivilID
	}
	
	var address *string
	if req.Address != "" {
		address = &req.Address
	}
	
	var updatedAt time.Time
	err = h.db.QueryRow(updateQuery, req.StudentNumber, civilID, req.FirstName, req.LastName, req.ArabicName, dateOfBirth, req.Gender, req.Nationality, address, req.IsActive, studentUUID).Scan(&updatedAt)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" { // unique violation
				return c.Status(409).JSON(models.ErrorResponse{
					Error:   true,
					Message: "Student number already exists",
				})
			}
		}
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to update student",
		})
	}
	
	return c.JSON(models.SuccessResponse{
		Success: true,
		Message: "Student updated successfully",
		Data: fiber.Map{
			"updated_at": updatedAt,
		},
	})
}

// DeleteStudent soft deletes a student
func (h *StudentHandler) DeleteStudent(c *fiber.Ctx) error {
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
	
	// Soft delete the student
	deleteQuery := `UPDATE students SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`
	_, err = h.db.Exec(deleteQuery, studentUUID)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to delete student",
		})
	}
	
	return c.JSON(models.SuccessResponse{
		Success: true,
		Message: "Student deleted successfully",
	})
}

// GetStudent retrieves a specific student
func (h *StudentHandler) GetStudent(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	studentID := c.Params("id")
	
	studentUUID, err := uuid.Parse(studentID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid student ID",
		})
	}
	
	// Get student with attendance rate
	query := `
		SELECT 
			s.id, s.student_number, s.civil_id, s.first_name, s.last_name, 
			s.arabic_name, s.date_of_birth, s.gender, s.nationality, s.address,
			s.class_id, s.enrollment_date, s.is_active, s.created_at, s.updated_at,
			COALESCE(attendance_rates.rate, 0) as attendance_rate,
			cl.name as class_name
		FROM students s
		JOIN classes cl ON s.class_id = cl.id
		LEFT JOIN (
			SELECT 
				student_id,
				COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*) as rate
			FROM attendance 
			WHERE date >= CURRENT_DATE - INTERVAL '30 days'
			GROUP BY student_id
		) attendance_rates ON s.id = attendance_rates.student_id
		WHERE s.id = $1 AND cl.teacher_id = $2 AND s.is_active = true
	`
	
	var student models.Student
	err = h.db.QueryRow(query, studentUUID, userID).Scan(
		&student.ID, &student.StudentNumber, &student.CivilID, 
		&student.FirstName, &student.LastName, &student.ArabicName,
		&student.DateOfBirth, &student.Gender, &student.Nationality,
		&student.Address, &student.ClassID, &student.EnrollmentDate,
		&student.IsActive, &student.CreatedAt, &student.UpdatedAt,
		&student.AttendanceRate, &student.ClassName,
	)
	
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Student not found",
		})
	}
	
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch student",
		})
	}
	
	return c.JSON(student)
}