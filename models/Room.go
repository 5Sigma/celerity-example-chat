package models

import "time"

// Room Description
type Room struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	Name      string     `json:"name"`
	Slug      string     `json:"slug"`
	Topic     string     `json:"topic"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
}
