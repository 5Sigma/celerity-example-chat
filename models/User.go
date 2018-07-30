package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

// User a chat user
type User struct {
	ID           uint       `gorm:"primary_key" json:"id"`
	Name         string     `json:"name"`
	PasswordHash string     `json:"-"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
	DeletedAt    *time.Time `json:"deletedAt"`
}

// SetPassword updates the password hash for the user
func (u *User) SetPassword(p string) {
	b, _ := bcrypt.GenerateFromPassword([]byte(p), 14)
	u.PasswordHash = string(b)
}

// Authenticate checks the user's password hash against the passed password
func (u *User) Authenticate(p string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(p))
	return err == nil
}
