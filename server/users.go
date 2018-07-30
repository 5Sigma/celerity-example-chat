package server

import (
	"errors"

	"github.com/5Sigma/celerity"
	"github.com/5Sigma/celerity-examples-chat/models"
)

// CreateUser creates a new user (POST /signup)
func (h *Handler) CreateUser(c celerity.Context) celerity.Response {
	u := &models.User{
		Name: c.ExtractValue("name").String(),
	}
	u.SetPassword(c.ExtractValue("password").String())
	h.DB.Create(&u)

	ses := models.Session{UserID: u.ID}
	h.DB.Create(&ses)
	ses.User = *u

	return c.R(ses)
}

// Login logs in a user (POST /login)
func (h *Handler) Login(c celerity.Context) celerity.Response {
	name := c.ExtractValue("name").String()
	pass := c.ExtractValue("password").String()
	var u models.User
	if h.DB.Where("name = ?", name).Find(&u).RecordNotFound() {
		return c.E(401, errors.New("invalid credentials"))
	}
	if !u.Authenticate(pass) {
		return c.E(401, errors.New("invalid credentials"))
	}

	ses := &models.Session{UserID: u.ID}
	h.DB.Create(&ses)
	ses.User = u

	return c.R(ses)
}

// ValidateSession validates if a session is valid and returns it
func (h *Handler) ValidateSession(c celerity.Context) celerity.Response {
	session := c.Get("session").(*models.Session)
	return c.R(session)
}
