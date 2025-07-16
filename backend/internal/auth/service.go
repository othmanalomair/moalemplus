package auth

import (
	"database/sql"
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"moalemplus/internal/models"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{db: db}
}

// Register creates a new user account
func (s *Service) Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}

	// Check if user already exists
	var existingUser models.User
	err := s.db.QueryRow("SELECT id FROM users WHERE civil_id = $1", req.CivilID).Scan(&existingUser.ID)
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{
			Error:   true,
			Message: "User with this civil ID already exists",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to hash password",
		})
	}

	// Parse school ID
	schoolID, err := uuid.Parse(req.SchoolID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid school ID format",
		})
	}

	// Create user
	user := models.User{
		ID:           uuid.New(),
		CivilID:      req.CivilID,
		FullName:     req.FullName,
		Email:        req.Email,
		Phone:        req.Phone,
		PasswordHash: string(hashedPassword),
		SchoolID:     schoolID,
		IsActive:     true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	_, err = s.db.Exec(`
		INSERT INTO users (id, civil_id, full_name, email, phone, password_hash, school_id, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`, user.ID, user.CivilID, user.FullName, user.Email, user.Phone, user.PasswordHash, user.SchoolID, user.IsActive, user.CreatedAt, user.UpdatedAt)
	
	if err != nil {
		// Log the actual error for debugging
		println("Database error:", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to create user: " + err.Error(),
		})
	}

	// Generate tokens
	accessToken, refreshToken, expiresIn, err := s.generateTokens(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to generate tokens",
		})
	}

	// Save refresh token
	err = s.saveRefreshToken(user.ID, refreshToken)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to save refresh token",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(models.AuthResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiresIn,
	})
}

// Login authenticates a user and returns JWT tokens
func (s *Service) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}

	// Find user by civil ID
	var user models.User
	err := s.db.QueryRow(`
		SELECT id, civil_id, full_name, email, phone, password_hash, school_id, is_active, created_at, updated_at
		FROM users WHERE civil_id = $1 AND is_active = true
	`, req.CivilID).Scan(&user.ID, &user.CivilID, &user.FullName, &user.Email, &user.Phone, &user.PasswordHash, &user.SchoolID, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
				Error:   true,
				Message: "Invalid credentials",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Database error",
		})
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid credentials",
		})
	}

	// Generate tokens
	accessToken, refreshToken, expiresIn, err := s.generateTokens(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to generate tokens",
		})
	}

	// Save refresh token
	err = s.saveRefreshToken(user.ID, refreshToken)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to save refresh token",
		})
	}

	return c.JSON(models.AuthResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiresIn,
	})
}

// RefreshToken generates new access token using refresh token
func (s *Service) RefreshToken(c *fiber.Ctx) error {
	var req models.RefreshTokenRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid request body",
		})
	}

	// Verify refresh token
	userID, err := s.verifyRefreshToken(req.RefreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Invalid refresh token",
		})
	}

	// Generate new tokens
	accessToken, refreshToken, expiresIn, err := s.generateTokens(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to generate tokens",
		})
	}

	// Save new refresh token
	err = s.saveRefreshToken(userID, refreshToken)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to save refresh token",
		})
	}

	return c.JSON(fiber.Map{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"expires_in":    expiresIn,
	})
}

// Logout revokes the refresh token
func (s *Service) Logout(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)

	// Revoke all refresh tokens for this user
	_, err := s.db.Exec("UPDATE sessions SET is_revoked = true WHERE user_id = $1", userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Failed to logout",
		})
	}

	return c.JSON(models.SuccessResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}

// GetMe returns current user information
func (s *Service) GetMe(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)

	var user models.User
	err := s.db.QueryRow(`
		SELECT id, civil_id, full_name, email, phone, school_id, is_active, created_at, updated_at
		FROM users WHERE id = $1 AND is_active = true
	`, userID).Scan(&user.ID, &user.CivilID, &user.FullName, &user.Email, &user.Phone, &user.SchoolID, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{
				Error:   true,
				Message: "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error:   true,
			Message: "Database error",
		})
	}

	return c.JSON(models.SuccessResponse{
		Success: true,
		Data:    user,
	})
}

// VerifyToken verifies the JWT token and returns user ID
func (s *Service) VerifyToken(tokenString string) (uuid.UUID, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(getJWTSecret()), nil
	})

	if err != nil || !token.Valid {
		return uuid.Nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return uuid.Nil, errors.New("invalid token claims")
	}

	userIDStr, ok := claims["user_id"].(string)
	if !ok {
		return uuid.Nil, errors.New("invalid user ID in token")
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return uuid.Nil, errors.New("invalid user ID format")
	}

	return userID, nil
}