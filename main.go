package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pooulad/nextjs-golang-crud-app/bootstrap"
	"github.com/pooulad/nextjs-golang-crud-app/repository"
)


type Repository repository.Repository

func main() {
	app := fiber.New()
	bootstrap.InitializeApp(app)
}