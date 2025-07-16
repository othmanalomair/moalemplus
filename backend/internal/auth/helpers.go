package auth

import (
	"database/sql"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"moalemplus/internal/models"
)

// getJWTSecret returns the JWT secret from environment variables
func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "your-default-secret-key-change-this-in-production"
	}
	return secret
}

// getJWTRefreshSecret returns the JWT refresh secret from environment variables
func getJWTRefreshSecret() string {
	secret := os.Getenv("JWT_REFRESH_SECRET")
	if secret == "" {
		return "your-default-refresh-secret-key-change-this-in-production"
	}
	return secret
}

// generateTokens generates access and refresh tokens for a user
func (s *Service) generateTokens(userID uuid.UUID) (string, string, int64, error) {
	// Access token expires in 15 minutes
	accessExpiry := time.Now().Add(15 * time.Minute)
	accessClaims := jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     accessExpiry.Unix(),
		"iat":     time.Now().Unix(),
		"type":    "access",
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString([]byte(getJWTSecret()))
	if err != nil {
		return "", "", 0, err
	}

	// Refresh token expires in 7 days
	refreshExpiry := time.Now().Add(7 * 24 * time.Hour)
	refreshClaims := jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     refreshExpiry.Unix(),
		"iat":     time.Now().Unix(),
		"type":    "refresh",
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString([]byte(getJWTRefreshSecret()))
	if err != nil {
		return "", "", 0, err
	}

	return accessTokenString, refreshTokenString, accessExpiry.Unix(), nil
}

// saveRefreshToken saves the refresh token to the database
func (s *Service) saveRefreshToken(userID uuid.UUID, refreshToken string) error {
	// First, revoke all existing refresh tokens for this user
	_, err := s.db.Exec("UPDATE sessions SET is_revoked = true WHERE user_id = $1", userID)
	if err != nil {
		return err
	}

	// Create new session
	session := models.Session{
		ID:           uuid.New(),
		UserID:       userID,
		RefreshToken: refreshToken,
		ExpiresAt:    time.Now().Add(7 * 24 * time.Hour),
		IsRevoked:    false,
		CreatedAt:    time.Now(),
	}

	_, err = s.db.Exec(`
		INSERT INTO sessions (id, user_id, refresh_token, expires_at, is_revoked, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, session.ID, session.UserID, session.RefreshToken, session.ExpiresAt, session.IsRevoked, session.CreatedAt)

	return err
}

// verifyRefreshToken verifies the refresh token and returns user ID
func (s *Service) verifyRefreshToken(tokenString string) (uuid.UUID, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(getJWTRefreshSecret()), nil
	})

	if err != nil || !token.Valid {
		return uuid.Nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return uuid.Nil, jwt.ErrInvalidKey
	}

	userIDStr, ok := claims["user_id"].(string)
	if !ok {
		return uuid.Nil, jwt.ErrInvalidKey
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return uuid.Nil, err
	}

	// Check if refresh token exists and is not revoked
	var session models.Session
	err = s.db.QueryRow(`
		SELECT id, user_id, refresh_token, expires_at, is_revoked, created_at
		FROM sessions
		WHERE refresh_token = $1 AND is_revoked = false AND expires_at > NOW()
	`, tokenString).Scan(&session.ID, &session.UserID, &session.RefreshToken, &session.ExpiresAt, &session.IsRevoked, &session.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return uuid.Nil, jwt.ErrTokenExpired
		}
		return uuid.Nil, err
	}

	return userID, nil
}