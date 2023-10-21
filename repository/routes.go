package repository

import (
	"os"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	_ "github.com/golang-jwt/jwt/v5"
)

func (repo *Repository) SetupRoutes(app *fiber.App) {

	api := app.Group("/api")
	// Unauthenticated route
	api.Get("/users", repo.GetUsers)
	api.Post("/user", repo.CreateUser)
	api.Patch("/user/:id", repo.UpdateUser)
	api.Delete("/user/:id", repo.DeleteUser)
	api.Post("/login", repo.Login)
	// Restricted Routes
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(os.Getenv("SECRET_JWT"))},
	}))
	api.Get("/user/:id", repo.GetUserByID)
	// api.Get("/authentication", repo.RequireAuth, repo.Authentication)
}
