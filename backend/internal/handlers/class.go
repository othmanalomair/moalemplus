package handlers

import (
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/lib/pq"

	"moalemplus/internal/models"
)

type ClassHandler struct {
	db *sql.DB
}

func NewClassHandler(db *sql.DB) *ClassHandler {
	return &ClassHandler{db: db}
}

// GetClasses retrieves all classes for a teacher
func (h *ClassHandler) GetClasses(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	
	query := `
		SELECT 
			c.id, c.name, c.teacher_id, c.subject_id, c.school_year, 
			c.semester, c.class_section, c.max_students, c.is_active, 
			c.created_at, c.updated_at,
			s.name as subject_name,
			COUNT(st.id) as student_count
		FROM classes c
		LEFT JOIN subjects s ON c.subject_id = s.id
		LEFT JOIN students st ON c.id = st.class_id AND st.is_active = true
		WHERE c.teacher_id = $1 AND c.is_active = true
		GROUP BY c.id, s.name
		ORDER BY c.created_at DESC
	`
	
	rows, err := h.db.Query(query, userID)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch classes",
		})
	}
	defer rows.Close()
	
	var classes []models.Class
	for rows.Next() {
		var class models.Class
		err := rows.Scan(
			&class.ID, &class.Name, &class.TeacherID, &class.SubjectID,
			&class.SchoolYear, &class.Semester, &class.ClassSection,
			&class.MaxStudents, &class.IsActive, &class.CreatedAt,
			&class.UpdatedAt, &class.SubjectName, &class.StudentCount,
		)
		if err != nil {
			continue
		}
		classes = append(classes, class)
	}
	
	// Ensure we always return an array, never null
	if classes == nil {
		classes = []models.Class{}
	}
	
	return c.JSON(classes)
}

// GetClass retrieves a specific class by ID
func (h *ClassHandler) GetClass(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	classID := c.Params("id")
	
	classUUID, err := uuid.Parse(classID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid class ID",
		})
	}
	
	query := `
		SELECT 
			c.id, c.name, c.teacher_id, c.subject_id, c.school_year, 
			c.semester, c.class_section, c.max_students, c.is_active, 
			c.created_at, c.updated_at,
			s.name as subject_name,
			COUNT(st.id) as student_count
		FROM classes c
		LEFT JOIN subjects s ON c.subject_id = s.id
		LEFT JOIN students st ON c.id = st.class_id AND st.is_active = true
		WHERE c.id = $1 AND c.teacher_id = $2 AND c.is_active = true
		GROUP BY c.id, s.name
	`
	
	var class models.Class
	err = h.db.QueryRow(query, classUUID, userID).Scan(
		&class.ID, &class.Name, &class.TeacherID, &class.SubjectID,
		&class.SchoolYear, &class.Semester, &class.ClassSection,
		&class.MaxStudents, &class.IsActive, &class.CreatedAt,
		&class.UpdatedAt, &class.SubjectName, &class.StudentCount,
	)
	
	if err == sql.ErrNoRows {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Class not found",
		})
	}
	
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch class",
		})
	}
	
	return c.JSON(class)
}

// CreateClass creates a new class
func (h *ClassHandler) CreateClass(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	
	var req models.CreateClassRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}
	
	// Validate subject exists
	subjectID, err := uuid.Parse(req.SubjectID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid subject ID",
		})
	}
	
	// Check if class already exists
	var existingID uuid.UUID
	checkQuery := `
		SELECT id FROM classes 
		WHERE teacher_id = $1 AND subject_id = $2 AND school_year = $3 
		AND semester = $4 AND class_section = $5 AND is_active = true
	`
	err = h.db.QueryRow(checkQuery, userID, subjectID, req.SchoolYear, req.Semester, req.ClassSection).Scan(&existingID)
	if err == nil {
		return c.Status(409).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Class already exists with this configuration",
		})
	}
	
	// Create the class
	classID := uuid.New()
	insertQuery := `
		INSERT INTO classes (id, name, teacher_id, subject_id, school_year, semester, class_section, max_students)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING created_at, updated_at
	`
	
	var createdAt, updatedAt time.Time
	err = h.db.QueryRow(insertQuery, classID, req.Name, userID, subjectID, req.SchoolYear, req.Semester, req.ClassSection, req.MaxStudents).Scan(&createdAt, &updatedAt)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" { // unique violation
				return c.Status(409).JSON(models.ErrorResponse{
					Error:   true,
					Message: "Class with this configuration already exists",
				})
			}
		}
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to create class",
		})
	}
	
	class := models.Class{
		ID:           classID,
		Name:         req.Name,
		TeacherID:    userID,
		SubjectID:    subjectID,
		SchoolYear:   req.SchoolYear,
		Semester:     req.Semester,
		ClassSection: req.ClassSection,
		MaxStudents:  req.MaxStudents,
		IsActive:     true,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
	}
	
	return c.Status(201).JSON(class)
}

// UpdateClass updates an existing class
func (h *ClassHandler) UpdateClass(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	classID := c.Params("id")
	
	classUUID, err := uuid.Parse(classID)
	if err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid class ID",
		})
	}
	
	var req models.UpdateClassRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
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
	
	// Update the class
	updateQuery := `
		UPDATE classes 
		SET name = $1, school_year = $2, semester = $3, class_section = $4, 
		    max_students = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
		WHERE id = $7 AND teacher_id = $8
		RETURNING updated_at
	`
	
	var updatedAt time.Time
	err = h.db.QueryRow(updateQuery, req.Name, req.SchoolYear, req.Semester, req.ClassSection, req.MaxStudents, req.IsActive, classUUID, userID).Scan(&updatedAt)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to update class",
		})
	}
	
	return c.JSON(models.SuccessResponse{
		Success: true,
		Message: "Class updated successfully",
		Data: fiber.Map{
			"updated_at": updatedAt,
		},
	})
}

// DeleteClass soft deletes a class
func (h *ClassHandler) DeleteClass(c *fiber.Ctx) error {
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
	
	// Soft delete the class
	deleteQuery := `UPDATE classes SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND teacher_id = $2`
	_, err = h.db.Exec(deleteQuery, classUUID, userID)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to delete class",
		})
	}
	
	return c.JSON(models.SuccessResponse{
		Success: true,
		Message: "Class deleted successfully",
	})
}

// GetClassStats retrieves statistics for a class
func (h *ClassHandler) GetClassStats(c *fiber.Ctx) error {
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
	
	// Get class statistics
	statsQuery := `
		SELECT 
			COUNT(s.id) as total_students,
			COUNT(CASE WHEN s.is_active = true THEN 1 END) as active_students,
			COUNT(CASE WHEN s.gender = 'male' AND s.is_active = true THEN 1 END) as male_students,
			COUNT(CASE WHEN s.gender = 'female' AND s.is_active = true THEN 1 END) as female_students,
			COALESCE(AVG(attendance_rates.rate), 0) as average_attendance
		FROM students s
		LEFT JOIN (
			SELECT 
				student_id,
				COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*) as rate
			FROM attendance 
			WHERE class_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'
			GROUP BY student_id
		) attendance_rates ON s.id = attendance_rates.student_id
		WHERE s.class_id = $1
	`
	
	var stats models.ClassStats
	err = h.db.QueryRow(statsQuery, classUUID).Scan(
		&stats.TotalStudents, &stats.ActiveStudents, &stats.MaleStudents, 
		&stats.FemaleStudents, &stats.AverageAttendance,
	)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to fetch class statistics",
		})
	}
	
	return c.JSON(stats)
}