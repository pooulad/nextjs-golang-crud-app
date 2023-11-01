package models

type User struct {
	ID       uint   `gorm:"primarykey;autoIncrement" json:"id"`
	Username string `json:"username" validate:"required,min=3,max=40"`
	Name     string `json:"name" validate:"required,min=3,max=40"`
	Email    string `json:"email" validate:"required,email,min=6,max=32"`
	Date     string `json:"date" validate:"required"`
	City     string `json:"city" validate:"required,max=40"`
	Country  string `json:"country" validate:"required,max=40"`
	Password string `json:"password" validate:"required,max=40"`
}
