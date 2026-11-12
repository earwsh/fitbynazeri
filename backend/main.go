package main

import (
	"log"
	"backend/controllers"
	"backend/database"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Initialize Database & Seed
	database.ConnectDB()

	// 2. Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName:   "Nazeri Fitness Academy API v1.0",
		BodyLimit: 50 * 1024 * 1024, // 50 MB max upload size
	})

	// 3. Middlewares
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Static route to serve uploaded media files directly from /uploads directory
	app.Static("/uploads", "./uploads")

	// 4. Routes
	api := app.Group("/api")

	// Health check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"message": "Nazeri Fitness Go API is running 🚀",
		})
	})

	// Auth & Users Management
	api.Post("/auth/login", controllers.Login)
	api.Get("/users", controllers.GetUsers)
	api.Post("/users", controllers.CreateUser)
	api.Put("/users/:id", controllers.UpdateUser)
	api.Delete("/users/:id", controllers.DeleteUser)

	// Blog Categories
	api.Get("/blog-categories", controllers.GetBlogCategories)
	api.Post("/blog-categories", controllers.CreateBlogCategory)
	api.Delete("/blog-categories/:id", controllers.DeleteBlogCategory)

	// Blog Articles (Public & Admin)
	api.Get("/blog", controllers.GetBlogPosts)
	api.Get("/blog/:slug", controllers.GetBlogPostBySlug)
	api.Post("/blog", controllers.CreateBlogPost)
	api.Put("/blog/:id", controllers.UpdateBlogPost)
	api.Delete("/blog/:id", controllers.DeleteBlogPost)

	// Blog Comments (Public & Admin)
	api.Get("/blog-comments/post/:slug", controllers.GetPostBlogComments)
	api.Get("/blog-comments", controllers.GetAllBlogComments)
	api.Post("/blog-comments", controllers.CreateBlogComment)
	api.Put("/blog-comments/:id/status", controllers.UpdateBlogCommentStatus)
	api.Put("/blog-comments/:id/reply", controllers.ReplyBlogComment)
	api.Delete("/blog-comments/:id", controllers.DeleteBlogComment)

	// Testimonials / Reviews (Public & Admin)
	api.Get("/testimonials/public", controllers.GetPublicTestimonials)
	api.Get("/testimonials", controllers.GetAllTestimonials)
	api.Post("/testimonials", controllers.CreateTestimonial)
	api.Put("/testimonials/:id/status", controllers.UpdateTestimonialStatus)
	api.Delete("/testimonials/:id", controllers.DeleteTestimonial)

	// Students Management (Admin & Supervisor)
	api.Get("/students", controllers.GetStudents)
	api.Get("/students/:slug", controllers.GetStudentBySlug)
	api.Post("/students", controllers.CreateStudent)
	api.Put("/students/:id", controllers.UpdateStudent)
	api.Delete("/students/:id", controllers.DeleteStudent)

	// SEO (Supervisor)
	api.Get("/seo", controllers.GetSEO)
	api.Put("/seo", controllers.UpdateSEO)

	// Hero Section CMS (Supervisor)
	api.Get("/hero-slides", controllers.GetHeroSlides)
	api.Put("/hero-slides/:id", controllers.UpdateHeroSlide)

	// About Section CMS (Supervisor)
	api.Get("/about-section", controllers.GetAboutSection)
	api.Put("/about-section", controllers.UpdateAboutSection)

	// Consultation Requests (Admin & Supervisor)
	api.Get("/consultations", controllers.GetConsultationRequests)
	api.Post("/consultations", controllers.CreateConsultationRequest)
	api.Put("/consultations/:id/status", controllers.UpdateConsultationStatus)

	// Media Library, Uploads & Image SEO
	api.Get("/media", controllers.GetMediaList)
	api.Post("/media/upload", controllers.UploadMedia)
	api.Put("/media/:id/seo", controllers.UpdateMediaSEO)
	api.Delete("/media/:id", controllers.DeleteMedia)

	// Plan Packages (Public read, Supervisor-only write)
	api.Get("/packages", controllers.GetPlanPackages)
	api.Get("/packages/:slug", controllers.GetPlanPackageBySlug)
	api.Post("/packages", controllers.RequireSuperAdmin, controllers.CreatePlanPackage)
	api.Put("/packages/:id", controllers.RequireSuperAdmin, controllers.UpdatePlanPackage)
	api.Delete("/packages/:id", controllers.RequireSuperAdmin, controllers.DeletePlanPackage)

	// Plan Orders (Intake & Delivery)
	api.Get("/plan-orders", controllers.GetAllPlanOrders)
	api.Get("/plan-orders/user/:email", controllers.GetUserPlanOrders)
	api.Post("/plan-orders", controllers.CreatePlanOrder)
	api.Put("/plan-orders/:id", controllers.UpdatePlanOrderStatus)
	api.Delete("/plan-orders/:id", controllers.DeletePlanOrder)

	// 5. Start Server on Port 8080
	log.Println("⚡ Server is listening on https://fitbynazeri.com")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
