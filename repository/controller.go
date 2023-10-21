package repository

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/morkid/paginate"
	"github.com/pooulad/nextjs-golang-crud-app/database/migrations"
	"github.com/pooulad/nextjs-golang-crud-app/database/models"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/go-playground/validator.v9"
	"net/http"
	"os"
	"time"
)

type ErrorResponse struct {
	FailedField string
	Tag         string
	Value       string
}

var validate = validator.New()

func ValidateStruct(user models.User) []*ErrorResponse {
	var errors []*ErrorResponse
	err := validate.Struct(user)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.FailedField = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
}

func (r *Repository) CreateUser(context *fiber.Ctx) error {
	user := models.User{}
	err := context.BodyParser(&user)

	if err != nil {
		context.Status(http.StatusUnprocessableEntity).JSON(
			&fiber.Map{"message": "Request failed"})

		return err
	}
	errors := ValidateStruct(user)
	if errors != nil {
		return context.Status(fiber.StatusBadRequest).JSON(errors)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Couldn't hash user password", "data": err})
	}

	user.Password = string(hash)

	if err := r.DB.Create(&user).Error; err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "data": err})
	}

	context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User has been added", "data": &fiber.Map{
		"id":       user.ID,
		"name":     user.Name,
		"username": user.Username,
		"email":    user.Email,
		"date":     user.Date,
		"city":     user.City,
		"country":  user.Country,
	}})
	return nil
}
func (r *Repository) UpdateUser(context *fiber.Ctx) error {
	user := models.User{}
	err := context.BodyParser(&user)

	if err != nil {
		context.Status(http.StatusUnprocessableEntity).JSON(
			&fiber.Map{"message": "Request failed"})

		return err
	}

	db := r.DB
	id := context.Params("id")

	if id == "" {
		context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "ID cannot be empty"})
		return nil
	}

	errors := ValidateStruct(user)
	if errors != nil {
		return context.Status(fiber.StatusBadRequest).JSON(errors)
	}
	if user.Password != "" {

		hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
		if err != nil {
			return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Couldn't hash user password", "data": err})
		}

		user.Password = string(hash)
	}

	if db.Model(&user).Where("id = ?", id).Updates(&user).RowsAffected == 0 {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Username is duplicate : database error"})
	}

	return context.JSON(fiber.Map{"status": "success", "message": "User successfully updated"})
}

func (r *Repository) DeleteUser(context *fiber.Ctx) error {
	userModel := migrations.Users{}
	id := context.Params("id")
	if id == "" {
		context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "ID cannot be empty"})
		return nil
	}

	err := r.DB.Delete(userModel, id)

	if err.Error != nil {
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "could not delete boo"})
		return err.Error
	}

	context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User delete successfully"})
	return nil
}
func (r *Repository) GetUsers(context *fiber.Ctx) error {
	db := r.DB
	model := db.Model(&migrations.Users{})

	pg := paginate.New(&paginate.Config{
		DefaultSize:        20,
		CustomParamEnabled: true,
	})

	page := pg.With(model).Request(context.Request()).Response(&[]migrations.Users{})

	context.Status(http.StatusOK).JSON(&fiber.Map{
		"data": page,
	})
	return nil
}

func (r *Repository) GetUserByID(context *fiber.Ctx) error {
	id := context.Params("id")
	userModel := &migrations.Users{}
	if id == "" {
		context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "ID cannot be empty"})
		return nil
	}

	err := r.DB.Where("id = ?", id).First(&userModel).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Could not get the user"})
		return err
	}

	user := context.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["sub"].(float64)
	context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User id fetched successfully", "data": userModel, "userId": userId})
	return nil
}

func (r *Repository) Login(context *fiber.Ctx) error {
	var body struct {
		Username string
		Password string
	}
	err := context.BodyParser(&body)
	if err != nil {
		context.Status(http.StatusUnprocessableEntity).JSON(
			&fiber.Map{"message": "Request failed"})

		return err
	}

	user := models.User{}
	db := r.DB

	db.First(&user, "username = ?", body.Username)

	if user.ID == 0 {
		context.Status(http.StatusBadRequest).JSON(
			&fiber.Map{"message": "invalid username or password"})

		return db.Error
	}

	compaireErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if compaireErr != nil {
		context.Status(http.StatusBadRequest).JSON(
			&fiber.Map{"message": "invalid password"})

		return compaireErr
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_JWT")))
	fmt.Print(os.Getenv("SECRET_JWT"))
	if err != nil {
		context.Status(http.StatusInternalServerError).JSON(
			&fiber.Map{"message": "failed to create token"})

		return err
	}

	context.Status(http.StatusOK).JSON(
		&fiber.Map{"token": tokenString})
	return nil
}