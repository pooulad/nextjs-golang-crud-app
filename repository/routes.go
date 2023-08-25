package repository

import (
	"github.com/gofiber/fiber/v2"
)

func (repo *Repository) SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Get("/users", repo.GetUsers)
	api.Post("/user", repo.CreateUser)
	api.Patch("/user/:id", repo.UpdateUser)
	api.Delete("/user/:id", repo.DeleteUser)
	api.Get("/user/:id", repo.GetUserByID)
	api.Post("/login", repo.Login)
	api.Get("/authentication", repo.RequireAuth, repo.Authentication)
}
