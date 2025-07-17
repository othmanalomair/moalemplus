package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
)

// User represents a teacher user in the system
type User struct {
	ID                 uuid.UUID  `json:"id" db:"id"`
	CivilID            string     `json:"civil_id" db:"civil_id"`
	FullName           string     `json:"full_name" db:"full_name"`
	Email              string     `json:"email" db:"email"`
	Phone              string     `json:"phone" db:"phone"`
	PasswordHash       string     `json:"-" db:"password_hash"`
	SchoolID           uuid.UUID  `json:"school_id" db:"school_id"`
	PrimarySubjectID   *uuid.UUID `json:"primary_subject_id" db:"primary_subject_id"`
	SecondarySubjectID *uuid.UUID `json:"secondary_subject_id" db:"secondary_subject_id"`
	SchoolType         string     `json:"school_type" db:"school_type"` // primary, intermediate, secondary
	IsActive           bool       `json:"is_active" db:"is_active"`
	CreatedAt          time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at" db:"updated_at"`
}

// School represents a school in the system
type School struct {
	ID               uuid.UUID    `json:"id" db:"id"`
	Name             string       `json:"name" db:"name"`
	District         string       `json:"district" db:"district"`
	Area             string       `json:"area" db:"area"`
	Type             string       `json:"type" db:"type"` // primary, intermediate, secondary
	Attendees        string       `json:"attendees" db:"attendees"` // male, female
	CreationDate     int          `json:"creation_date" db:"creation_date"`
	PhoneNumbers     StringArray  `json:"phone_numbers" db:"phone_numbers"`
	AutomaticNumber  string       `json:"automatic_number" db:"automatic_number"`
	LocationURL      string       `json:"location_url" db:"location_url"`
	IsActive         bool         `json:"is_active" db:"is_active"`
	CreatedAt        time.Time    `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time    `json:"updated_at" db:"updated_at"`
}

// Session represents a user session
type Session struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"user_id" db:"user_id"`
	RefreshToken string    `json:"refresh_token" db:"refresh_token"`
	ExpiresAt    time.Time `json:"expires_at" db:"expires_at"`
	IsRevoked    bool      `json:"is_revoked" db:"is_revoked"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

// LoginRequest represents the login request payload
type LoginRequest struct {
	CivilID  string `json:"civil_id" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// RegisterRequest represents the registration request payload
type RegisterRequest struct {
	CivilID            string  `json:"civil_id" validate:"required"`
	FullName           string  `json:"full_name" validate:"required"`
	Email              string  `json:"email" validate:"required,email"`
	Phone              string  `json:"phone" validate:"required"`
	Password           string  `json:"password" validate:"required,min=8"`
	SchoolID           string  `json:"school_id" validate:"required"`
	PrimarySubjectID   string  `json:"primary_subject_id" validate:"required"`
	SecondarySubjectID *string `json:"secondary_subject_id,omitempty"` // Optional, only for Islamic Education teachers
	SchoolType         string  `json:"school_type" validate:"required"` // primary, intermediate, secondary
}

// AuthResponse represents the authentication response
type AuthResponse struct {
	User         User   `json:"user"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
}

// RefreshTokenRequest represents the refresh token request
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}

// SuccessResponse represents a success response
type SuccessResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// StringArray is a custom type for handling PostgreSQL string arrays
type StringArray []string

// Scan implements the sql.Scanner interface
func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = nil
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, s)
	case string:
		return json.Unmarshal([]byte(v), s)
	default:
		return errors.New("cannot scan into StringArray")
	}
}

// Value implements the driver.Valuer interface
func (s StringArray) Value() (driver.Value, error) {
	if s == nil {
		return nil, nil
	}
	return json.Marshal(s)
}