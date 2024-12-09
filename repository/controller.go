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

// CreateUser handles the creation of a new user.
// 
// @Summary      Create a new user
// @Description  Accepts user details, validates input, hashes the password, and stores the user in the database.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        user  body      models.User  true  "User details"
// @Success      200   {object}  map[string]interface{}  "User created successfully"
// @Failure      400   {object}  map[string]interface{}  "Invalid user data or request error"
// @Failure      422   {object}  map[string]interface{}  "Request body parsing failed"
// @Failure      500   {object}  map[string]interface{}  "Server error"
// @Router       /users [post]
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

// UpdateUser updates the details of an existing user.
// 
// @Summary      Update user details
// @Description  Updates user details such as name, email, or password. Requires a valid user ID.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id    path      string        true  "User ID"
// @Param        user  body      models.User   true  "Updated user details"
// @Success      200   {object}  map[string]interface{}  "User updated successfully"
// @Failure      400   {object}  map[string]interface{}  "Invalid user data or request error"
// @Failure      422   {object}  map[string]interface{}  "Request body parsing failed"
// @Failure      500   {object}  map[string]interface{}  "Server error"
// @Router       /users/{id} [put]
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

// DeleteUser deletes an existing user.
// 
// @Summary      Delete a user
// @Description  Deletes a user from the database. Requires a valid user ID.
// @Tags         users
// @Produce      json
// @Param        id  path      string  true  "User ID"
// @Success      200  {object}  map[string]interface{}  "User deleted successfully"
// @Failure      400  {object}  map[string]interface{}  "Database error during deletion"
// @Failure      500  {object}  map[string]interface{}  "ID cannot be empty"
// @Router       /users/{id} [delete]
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

// GetUsers retrieves a paginated list of users.
// 
// @Summary      List users
// @Description  Fetches a paginated list of users from the database.
// @Tags         users
// @Produce      json
// @Param        page     query     int    false  "Page number"
// @Param        size     query     int    false  "Page size"
// @Success      200  {object}  map[string]interface{}  "Paginated list of users"
// @Failure      500  {object}  map[string]interface{}  "Server error"
// @Router       /users [get]
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

// GetUserByID retrieves a user's details by ID.
// 
// @Summary      Get user by ID
// @Description  Fetches details of a user based on their ID.
// @Tags         users
// @Produce      json
// @Param        id  path      string  true  "User ID"
// @Success      200  {object}  map[string]interface{}  "User details and associated claims"
// @Failure      400  {object}  map[string]interface{}  "Could not fetch the user"
// @Failure      500  {object}  map[string]interface{}  "ID cannot be empty"
// @Router       /users/{id} [get]
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

// Login authenticates a user and returns a JWT token.
// 
// @Summary      User login
// @Description  Authenticates a user with their username and password. Returns a JWT token upon successful login.
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        credentials  body      LoginRequest  true  "User credentials"
// @Success      200  {object}  LoginResponseOK  "JWT token for the user"
// @Failure      400  {object}  LoginResponseFailure  "Invalid username or password"
// @Failure      422  {object}  LoginResponseFailure  "Request body parsing failed"
// @Failure      500  {object}  LoginResponseFailure  "Failed to create token"
// @Router       /login [post]
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