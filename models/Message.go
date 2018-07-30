package models

import "time"

// Message a chat message
type Message struct {
	ID              uint        `gorm:"primary_key" json:"id"`
	CreatedAt       time.Time   `json:"createdAt"`
	UpdatedAt       time.Time   `json:"updatedAt"`
	DeletedAt       *time.Time  `json:"deletedAt"`
	Sender          User        `json:"sender"`
	SenderID        uint        `json:"-"`
	DestinationType string      `json:"-"`
	DestinationID   uint        `json:"-"`
	Destination     interface{} `json:"destination" gorm:"-"`
	Message         string      `json:"message"`
}
