package migrations

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	ID       uint      `gorm:"primarykey;autoIncrement" json:"id"`
	Name     *string   `json:"name"`
	Email    *string   `json:"email"`
	Date     time.Time `json:"date"`
	City     *string   `json:"city"`
	Country  *string   `json:"country"`
	Password *string   `json:"-"`
}

func MigrateUsers(db *gorm.DB) error {
	err := db.AutoMigrate(&Users{})
	return err
}
