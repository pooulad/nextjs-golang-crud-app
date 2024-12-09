package main

import (
	_ "github.com/pooulad/nextjs-golang-crud-app/docs"
	"github.com/gofiber/fiber/v2"
	"github.com/pooulad/nextjs-golang-crud-app/bootstrap"
	"github.com/pooulad/nextjs-golang-crud-app/repository"
)

type Repository repository.Repository

//	@title			nextjs-golang-crud-app API
//	@version		1.0
//	@description	nextjs-golang-crud-app API
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@host		localhost:8080
//	@BasePath	/api

//	@securityDefinitions.basic	BasicAuth

//	@securityDefinitions.apikey	ApiKeyAuth
//	@in							header
//	@name						Authorization
//	@description				Handling auth in project

func main() {
	app := fiber.New()
	bootstrap.InitializeApp(app)
}
