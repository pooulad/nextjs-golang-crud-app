package repository

import (
	"github.com/gofiber/fiber/v2"
)

func (repo *Repository) SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Get("/users", repo.GetUsers)
	api.Post("/users", repo.CreateUser)
	api.Patch("/users/:id", repo.UpdateUser)
	api.Delete("/users/:id", repo.DeleteUser)
	api.Get("/users/:id", repo.GetUserByID)
}
