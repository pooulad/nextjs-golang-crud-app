package repository

import (
	// "os"
	// jwtware "github.com/gofiber/contrib/jwt"
	// _ "github.com/golang-jwt/jwt/v5"
	middlewares "github.com/pooulad/nextjs-golang-crud-app/middleware"
	"github.com/gofiber/fiber/v2"
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
	// app.Use(jwtware.New(jwtware.Config{
	// 	SigningKey: jwtware.SigningKey{Key: []byte(os.Getenv("SECRET_JWT"))},
	// }))
	jwtFunc := middlewares.NewAuthMiddleware()
	api.Get("/user/:id",jwtFunc, repo.GetUserByID)
	// api.Get("/authentication", repo.RequireAuth, repo.Authentication)
}
