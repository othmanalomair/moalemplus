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
	"github.com/lib/pq"
	_ "github.com/lib/pq"

	"moalemplus/internal/auth"
	"moalemplus/internal/handlers"
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
		AllowOrigins: "http://localhost:3000,http://localhost:3001,http://192.168.8.8:3001",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Initialize services
	authService := auth.NewService(db)
	classHandler := handlers.NewClassHandler(db)
	studentHandler := handlers.NewStudentHandler(db)
	attendanceHandler := handlers.NewAttendanceHandler(db)

	// API routes
	api := app.Group("/api")
	
	// Auth routes
	authRoutes := api.Group("/auth")
	authRoutes.Post("/register", authService.Register)
	authRoutes.Post("/login", authService.Login)
	authRoutes.Post("/refresh", authService.RefreshToken)
	authRoutes.Post("/logout", middleware.AuthMiddleware(authService), authService.Logout)
	authRoutes.Get("/me", middleware.AuthMiddleware(authService), authService.GetMe)
	
	// Protected routes (require authentication) - use specific middleware instead of group
	// Class routes
	api.Get("/classes", middleware.AuthMiddleware(authService), classHandler.GetClasses)
	api.Post("/classes", middleware.AuthMiddleware(authService), classHandler.CreateClass)
	api.Get("/classes/:id", middleware.AuthMiddleware(authService), classHandler.GetClass)
	api.Put("/classes/:id", middleware.AuthMiddleware(authService), classHandler.UpdateClass)
	api.Delete("/classes/:id", middleware.AuthMiddleware(authService), classHandler.DeleteClass)
	api.Get("/classes/:id/stats", middleware.AuthMiddleware(authService), classHandler.GetClassStats)
	
	// Student routes
	api.Get("/classes/:id/students", middleware.AuthMiddleware(authService), studentHandler.GetClassStudents)
	api.Post("/classes/:id/students", middleware.AuthMiddleware(authService), studentHandler.CreateStudent)
	api.Get("/students/:id", middleware.AuthMiddleware(authService), studentHandler.GetStudent)
	api.Put("/students/:id", middleware.AuthMiddleware(authService), studentHandler.UpdateStudent)
	api.Delete("/students/:id", middleware.AuthMiddleware(authService), studentHandler.DeleteStudent)
	
	// Attendance routes
	api.Post("/classes/:id/attendance", middleware.AuthMiddleware(authService), attendanceHandler.CreateAttendance)
	api.Get("/classes/:id/attendance/:date", middleware.AuthMiddleware(authService), attendanceHandler.GetClassAttendance)
	api.Put("/attendance/:id", middleware.AuthMiddleware(authService), attendanceHandler.UpdateAttendance)
	api.Get("/students/:id/attendance-report", middleware.AuthMiddleware(authService), attendanceHandler.GetStudentAttendanceReport)
	
	// Public endpoints (no auth required)
	// Schools endpoint
	api.Get("/schools", func(c *fiber.Ctx) error {
		rows, err := db.Query(`
			SELECT id, name, district, area, type, attendees, creation_date, 
			       phone_numbers, automatic_number, location_url, is_active 
			FROM schools 
			WHERE is_active = true 
			ORDER BY name
		`)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch schools"})
		}
		defer rows.Close()
		
		var schools []fiber.Map
		for rows.Next() {
			var id, name, district, area, schoolType, attendees, automaticNumber, locationURL string
			var creationDate int
			var phoneNumbers pq.StringArray
			var isActive bool
			err := rows.Scan(&id, &name, &district, &area, &schoolType, &attendees, 
				&creationDate, &phoneNumbers, &automaticNumber, &locationURL, &isActive)
			if err != nil {
				continue
			}
			schools = append(schools, fiber.Map{
				"id": id,
				"name": name,
				"district": district,
				"area": area,
				"type": schoolType,
				"attendees": attendees,
				"creation_date": creationDate,
				"phone_numbers": []string(phoneNumbers),
				"automatic_number": automaticNumber,
				"location_url": locationURL,
				"is_active": isActive,
			})
		}
		return c.JSON(schools)
	})

	// Subjects endpoint
	api.Get("/subjects", func(c *fiber.Ctx) error {
		rows, err := db.Query("SELECT id, name, name_arabic, code, school_type, grade_level, is_active FROM subjects WHERE is_active = true ORDER BY name_arabic")
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch subjects"})
		}
		defer rows.Close()
		
		var subjects []fiber.Map
		for rows.Next() {
			var id, name, nameArabic, code, schoolType string
			var gradeLevel int
			var isActive bool
			err := rows.Scan(&id, &name, &nameArabic, &code, &schoolType, &gradeLevel, &isActive)
			if err != nil {
				continue
			}
			subjects = append(subjects, fiber.Map{
				"id": id,
				"name": name,
				"name_arabic": nameArabic,
				"code": code,
				"school_type": schoolType,
				"grade_level": gradeLevel,
				"is_active": isActive,
			})
		}
		if subjects == nil {
			subjects = []fiber.Map{}
		}
		return c.JSON(subjects)
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