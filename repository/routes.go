package repository

import (
	"github.com/gofiber/fiber/v2"
	middlewares "github.com/pooulad/nextjs-golang-crud-app/middleware"
	"github.com/gofiber/swagger"
	_ "github.com/pooulad/nextjs-golang-crud-app/docs"
)

func (repo *Repository) SetupRoutes(app *fiber.App) {
	app.Get("/swagger/*", swagger.HandlerDefault)

	api := app.Group("/api")
	// Unauthenticated route
	api.Post("/user", repo.CreateUser)
	api.Patch("/user/:id", repo.UpdateUser)
	api.Delete("/user/:id", repo.DeleteUser)
	api.Post("/login", repo.Login)
	// Restricted Routes
	jwtFunc := middlewares.NewAuthMiddleware()
	api.Get("/users", jwtFunc, repo.GetUsers)
	api.Get("/user/:id", jwtFunc, repo.GetUserByID)
}
