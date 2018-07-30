package models

import (
	"strconv"
	"time"

	"github.com/sony/sonyflake"
)

var idGenerator = sonyflake.NewSonyflake(sonyflake.Settings{})

// Session an authenticed user session
type Session struct {
	ID        uint      `gorm:"primary_key" json:"-"`
	UserID    uint      `json:"-"`
	User      User      `json:"user"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"-"`
}

// BeforeCreate gorm lifecycle event
func (s *Session) BeforeCreate() {
	id, _ := idGenerator.NextID()
	s.Token = strconv.FormatInt(int64(id), 16)
}
