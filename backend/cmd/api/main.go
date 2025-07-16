package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"moalemplus/internal/auth"
	"moalemplus/internal/middleware"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Database connection
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error":   true,
				"message": err.Error(),
			})
		},
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,http://localhost:3001",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Initialize auth service
	authService := auth.NewService(db)

	// API routes
	api := app.Group("/api")
	
	// Auth routes
	authRoutes := api.Group("/auth")
	authRoutes.Post("/register", authService.Register)
	authRoutes.Post("/login", authService.Login)
	authRoutes.Post("/refresh", authService.RefreshToken)
	authRoutes.Post("/logout", middleware.AuthMiddleware(authService), authService.Logout)
	authRoutes.Get("/me", middleware.AuthMiddleware(authService), authService.GetMe)
	
	// Schools endpoint
	api.Get("/schools", func(c *fiber.Ctx) error {
		rows, err := db.Query("SELECT id, name, district, area, type, is_active FROM schools WHERE is_active = true ORDER BY name")
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch schools"})
		}
		defer rows.Close()
		
		var schools []fiber.Map
		for rows.Next() {
			var id, name, district, area, schoolType string
			var isActive bool
			err := rows.Scan(&id, &name, &district, &area, &schoolType, &isActive)
			if err != nil {
				continue
			}
			schools = append(schools, fiber.Map{
				"id": id,
				"name": name,
				"district": district,
				"area": area,
				"type": schoolType,
				"is_active": isActive,
			})
		}
		return c.JSON(schools)
	})

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"message": "Moalem Plus API is running",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}