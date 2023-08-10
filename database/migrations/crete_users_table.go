package migrations

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	ID       uint      `gorm:"primarykey;autoIncrement" json:"id"`
	Username *string   `gorm:"unique" json:"username"`
	Name     *string   `json:"name"`
	Email    *string   `gorm:"unique" json:"email"`
	Date     time.Time `json:"date"`
	City     *string   `json:"city"`
	Country  *string   `json:"country"`
	Password *string   `json:"-"`
}

func MigrateUsers(db *gorm.DB) error {
	err := db.AutoMigrate(&Users{})
	return err
}
