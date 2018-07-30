package server

import (
	"strings"

	"github.com/5Sigma/celerity"
	"github.com/5Sigma/celerity-examples-chat/models"
)

// SocketHandler Websocket channel for /ws
func (h *Handler) SocketHandler(client *celerity.SocketClient, e celerity.ChannelEvent) {
	println(string(e.Event) + " - " + string(e.Data))

	if e.Event == celerity.ChannelEvents.Connect {
		var ses models.Session
		if h.DB.
			Where("token = ?", client.Context.URLParams.String("token")).
			Preload("User").
			Find(&ses).RecordNotFound() {
			return
		}
		client.Context.Set("session", &ses)
	}

	if e.Event == celerity.ChannelEvents.Disconnect {
		ses, ok := client.Context.Get("session").(*models.Session)
		if ok {
			client.Context.Log.Debugf("client %s disconnected", ses.User.Name)
		} else {
			client.Context.Log.Debug("unknown client disconnected")
		}
		for _, r := range client.Rooms {
			r.Remove(client)
			broadCastRoomUsers(r)
		}
	}

	if e.Event == celerity.ChannelEvents.Message {
		session, ok := client.Context.Get("session").(*models.Session)
		if !ok {
			client.Context.Log.Error("unauthenticated message")
			return
		}
		user := session.User
		switch e.Get("action").String() {
		case "room-message":
			slug := e.Get("slug").String()
			messageBody := strings.TrimSpace(e.Get("message").String())
			if messageBody == "" {
				return
			}
			var room models.Room
			if h.DB.Where("slug = ?", slug).First(&room).RecordNotFound() {
				return
			}
			message := models.Message{
				Sender:          user,
				DestinationID:   room.ID,
				DestinationType: "room",
				Message:         messageBody,
			}
			h.DB.Create(&message)
			message.Destination = room
			client.Channel().Room(room.Slug).Broadcast(SocketEvent{
				Event: "room-message",
				Data:  message,
			})
		case "join-room":
			slug := e.Get("slug").String()
			var room models.Room
			if h.DB.Where("slug = ?", slug).First(&room).RecordNotFound() {
				return
			}
			r := client.Channel().Room(slug)
			r.Add(client)
			broadCastRoomUsers(r)
		case "part-room":
			slug := e.Get("slug").String()
			var room models.Room
			if h.DB.Where("slug = ?", slug).First(&room).RecordNotFound() {
				return
			}
			r := client.Channel().Room(slug)
			r.Remove(client)
			broadCastRoomUsers(r)
		}
	}
}

func broadCastRoomUsers(r *celerity.ChannelRoom) {
	usersMap := map[uint]models.User{}
	for _, c := range r.Clients {
		ses, ok := c.Context.Get("session").(*models.Session)
		if ok {
			usersMap[ses.User.ID] = ses.User
		}
	}
	channelUsers := []models.User{}
	for _, v := range usersMap {
		channelUsers = append(channelUsers, v)
	}
	r.Broadcast(SocketEvent{
		Event: "room-users",
		Data: struct {
			Room  string        `json:"slug"`
			Users []models.User `json:"users"`
		}{
			Room:  r.Name,
			Users: channelUsers,
		},
	})
}
