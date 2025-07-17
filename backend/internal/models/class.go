package models

import (
	"time"

	"github.com/google/uuid"
)

// Class represents a class in the system
type Class struct {
	ID           uuid.UUID `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	TeacherID    uuid.UUID `json:"teacher_id" db:"teacher_id"`
	SubjectID    uuid.UUID `json:"subject_id" db:"subject_id"`
	SchoolYear   string    `json:"school_year" db:"school_year"`
	Semester     string    `json:"semester" db:"semester"`
	ClassSection string    `json:"class_section" db:"class_section"`
	MaxStudents  int       `json:"max_students" db:"max_students"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
	
	// Joined fields
	SubjectName   string `json:"subject_name,omitempty" db:"subject_name"`
	StudentCount  int    `json:"student_count,omitempty" db:"student_count"`
}

// Student represents a student in the system
type Student struct {
	ID             uuid.UUID `json:"id" db:"id"`
	StudentNumber  string    `json:"student_number" db:"student_number"`
	CivilID        *string   `json:"civil_id,omitempty" db:"civil_id"`
	FirstName      string    `json:"first_name" db:"first_name"`
	LastName       string    `json:"last_name" db:"last_name"`
	ArabicName     string    `json:"arabic_name" db:"arabic_name"`
	DateOfBirth    time.Time `json:"date_of_birth" db:"date_of_birth"`
	Gender         string    `json:"gender" db:"gender"`
	Nationality    string    `json:"nationality" db:"nationality"`
	Address        *string   `json:"address,omitempty" db:"address"`
	ClassID        uuid.UUID `json:"class_id" db:"class_id"`
	EnrollmentDate time.Time `json:"enrollment_date" db:"enrollment_date"`
	IsActive       bool      `json:"is_active" db:"is_active"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
	
	// Joined fields
	AttendanceRate *float64 `json:"attendance_rate,omitempty" db:"attendance_rate"`
	ClassName      string   `json:"class_name,omitempty" db:"class_name"`
}

// Attendance represents an attendance record
type Attendance struct {
	ID         uuid.UUID `json:"id" db:"id"`
	StudentID  uuid.UUID `json:"student_id" db:"student_id"`
	ClassID    uuid.UUID `json:"class_id" db:"class_id"`
	Date       time.Time `json:"date" db:"date"`
	Status     string    `json:"status" db:"status"`
	Notes      *string   `json:"notes,omitempty" db:"notes"`
	RecordedBy uuid.UUID `json:"recorded_by" db:"recorded_by"`
	RecordedAt time.Time `json:"recorded_at" db:"recorded_at"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
	
	// Joined fields
	StudentName string `json:"student_name,omitempty" db:"student_name"`
	StudentNumber string `json:"student_number,omitempty" db:"student_number"`
}

// CreateClassRequest represents the request to create a new class
type CreateClassRequest struct {
	Name         string `json:"name" validate:"required"`
	SubjectID    string `json:"subject_id" validate:"required"`
	SchoolYear   string `json:"school_year" validate:"required"`
	Semester     string `json:"semester" validate:"required,oneof=first second"`
	ClassSection string `json:"class_section" validate:"required"`
	MaxStudents  int    `json:"max_students" validate:"min=1,max=50"`
}

// UpdateClassRequest represents the request to update a class
type UpdateClassRequest struct {
	Name         string `json:"name" validate:"required"`
	SchoolYear   string `json:"school_year" validate:"required"`
	Semester     string `json:"semester" validate:"required,oneof=first second"`
	ClassSection string `json:"class_section" validate:"required"`
	MaxStudents  int    `json:"max_students" validate:"min=1,max=50"`
	IsActive     bool   `json:"is_active"`
}

// CreateStudentRequest represents the request to create a new student
type CreateStudentRequest struct {
	StudentNumber string `json:"student_number" validate:"required"`
	CivilID       string `json:"civil_id,omitempty"`
	FirstName     string `json:"first_name" validate:"required"`
	LastName      string `json:"last_name" validate:"required"`
	ArabicName    string `json:"arabic_name" validate:"required"`
	DateOfBirth   string `json:"date_of_birth" validate:"required"`
	Gender        string `json:"gender" validate:"required,oneof=male female"`
	Nationality   string `json:"nationality" validate:"required"`
	Address       string `json:"address,omitempty"`
}

// UpdateStudentRequest represents the request to update a student
type UpdateStudentRequest struct {
	StudentNumber string `json:"student_number" validate:"required"`
	CivilID       string `json:"civil_id,omitempty"`
	FirstName     string `json:"first_name" validate:"required"`
	LastName      string `json:"last_name" validate:"required"`
	ArabicName    string `json:"arabic_name" validate:"required"`
	DateOfBirth   string `json:"date_of_birth" validate:"required"`
	Gender        string `json:"gender" validate:"required,oneof=male female"`
	Nationality   string `json:"nationality" validate:"required"`
	Address       string `json:"address,omitempty"`
	IsActive      bool   `json:"is_active"`
}

// AttendanceRecord represents a single attendance record for bulk operations
type AttendanceRecord struct {
	StudentID uuid.UUID `json:"student_id" validate:"required"`
	Status    string    `json:"status" validate:"required,oneof=present absent late excused"`
	Notes     string    `json:"notes,omitempty"`
}

// CreateAttendanceRequest represents the request to create attendance records
type CreateAttendanceRequest struct {
	ClassID uuid.UUID          `json:"class_id" validate:"required"`
	Date    string             `json:"date" validate:"required"`
	Records []AttendanceRecord `json:"records" validate:"required,min=1"`
}

// AttendanceStats represents attendance statistics for a student or class
type AttendanceStats struct {
	TotalDays    int     `json:"total_days"`
	PresentDays  int     `json:"present_days"`
	AbsentDays   int     `json:"absent_days"`
	LateDays     int     `json:"late_days"`
	ExcusedDays  int     `json:"excused_days"`
	AttendanceRate float64 `json:"attendance_rate"`
}

// ClassStats represents statistics for a class
type ClassStats struct {
	TotalStudents    int     `json:"total_students"`
	AverageAttendance float64 `json:"average_attendance"`
	ActiveStudents   int     `json:"active_students"`
	MaleStudents     int     `json:"male_students"`
	FemaleStudents   int     `json:"female_students"`
}

// Subject represents a subject in the system
type Subject struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Code      string    `json:"code" db:"code"`
	IsActive  bool      `json:"is_active" db:"is_active"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// AttendanceReport represents attendance data for reports
type AttendanceReport struct {
	Date      time.Time `json:"date" db:"date"`
	Students  []Student `json:"students"`
	Attendances []Attendance `json:"attendances"`
	Stats     AttendanceStats `json:"stats"`
}