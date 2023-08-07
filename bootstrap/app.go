package bootstrap

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/pooulad/nextjs-golang-crud-app/database/migrations"
	"github.com/pooulad/nextjs-golang-crud-app/database/migrations/models/storage"
	"github.com/pooulad/nextjs-golang-crud-app/repository"
)


func InitializeApp(app *fiber.App) {
	_, ok := os.LookupEnv("APP_ENV")

	if !ok {
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal(err)
		}
	}
	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}

	db, err := storage.NewConnection(config)
	if err != nil {
		log.Fatal("could not load the database")
	}

	err = migrations.MigrateUsers(db)

	if err != nil {
		log.Fatal("Could not migrate db")
	}

	repo := repository.Repository{
		DB: db,
	}
	app.Use(cors.New(cors.Config{AllowCredentials: true}))
	repo.SetupRoutes(app)
	app.Listen(":8080")
}