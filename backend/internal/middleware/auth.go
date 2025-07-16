package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"moalemplus/internal/auth"
	"moalemplus/internal/models"
)

// AuthMiddleware validates JWT tokens and sets user context
func AuthMiddleware(authService *auth.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get token from Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
				Error:   true,
				Message: "Authorization header is required",
			})
		}

		// Check if token starts with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
				Error:   true,
				Message: "Invalid authorization header format",
			})
		}

		// Extract token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
				Error:   true,
				Message: "Token is required",
			})
		}

		// Verify token
		userID, err := authService.VerifyToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
				Error:   true,
				Message: "Invalid or expired token",
			})
		}

		// Set user ID in context
		c.Locals("user_id", userID)

		return c.Next()
	}
}

// OptionalAuthMiddleware validates JWT tokens but doesn't require them
func OptionalAuthMiddleware(authService *auth.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get token from Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Next()
		}

		// Check if token starts with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Next()
		}

		// Extract token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == "" {
			return c.Next()
		}

		// Verify token
		userID, err := authService.VerifyToken(tokenString)
		if err != nil {
			return c.Next()
		}

		// Set user ID in context
		c.Locals("user_id", userID)

		return c.Next()
	}
}

// AdminMiddleware checks if user is admin (placeholder for future implementation)
func AdminMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id")
		if userID == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{
				Error:   true,
				Message: "Authentication required",
			})
		}

		// TODO: Implement admin check when user roles are added
		// For now, all authenticated users can access admin routes
		return c.Next()
	}
}

// RateLimitMiddleware provides basic rate limiting (placeholder for future implementation)
func RateLimitMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: Implement proper rate limiting with Redis
		// For now, just pass through
		return c.Next()
	}
}

// CORSMiddleware handles CORS preflight requests
func CORSMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}

		return c.Next()
	}
}

// GetUserIDFromContext extracts user ID from fiber context
func GetUserIDFromContext(c *fiber.Ctx) (uuid.UUID, error) {
	userID := c.Locals("user_id")
	if userID == nil {
		return uuid.Nil, fiber.NewError(fiber.StatusUnauthorized, "User not authenticated")
	}

	id, ok := userID.(uuid.UUID)
	if !ok {
		return uuid.Nil, fiber.NewError(fiber.StatusInternalServerError, "Invalid user ID format")
	}

	return id, nil
}