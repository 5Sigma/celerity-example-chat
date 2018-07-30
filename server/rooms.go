package server

import (
	"errors"

	"github.com/5Sigma/celerity"
	"github.com/5Sigma/celerity-examples/chat/models"
)

// CreateRoom Creates a new chat room (/POST/rooms)
func (h *Handler) CreateRoom(c celerity.Context) celerity.Response {
	var room *models.Room
	if err := c.Extract(&room); err != nil {
		return c.E(400, err)
	}

	var count int
	h.DB.Model(models.Room{}).Where("slug = ?", room.Slug).Count(&count)
	if count != 0 {
		return c.E(400, errors.New("This room already exists."))
	}

	h.DB.Create(&room)
	return c.R(&room)
}

// GetRoom returns the details of a room
func (h *Handler) GetRoom(c celerity.Context) celerity.Response {
	var room models.Room
	slug := c.URLParams.String("slug")
	if h.DB.Where("slug = ?", slug).Find(&room).RecordNotFound() {
		return c.E(404, errors.New("room not found"))
	}
	return c.R(room)
}
