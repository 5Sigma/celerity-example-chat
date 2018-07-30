package server

import (
	"github.com/5Sigma/celerity"
	"github.com/5Sigma/celerity-example-chat/models"
	"github.com/5Sigma/celerity/middleware"
	"github.com/jinzhu/gorm"
	//GORM SQLITE
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

// Handler endpoint handler
type Handler struct {
	DB *gorm.DB
}

// SocketEvent is the datastructure used to send events to the client
type SocketEvent struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}

// Setup sets up all endpoints and middleware for the server
func Setup() *celerity.Server {
	db, _ := gorm.Open("sqlite3", "./data.sqlite3")
	db.LogMode(true)

	db.AutoMigrate(
		models.User{},
		models.Room{},
		models.Message{},
		models.Session{},
	)

	var lobbyCount int

	db.Model(&models.Room{}).Where("slug = ?", "lobby").Count(&lobbyCount)
	if lobbyCount == 0 {
		db.Create(&models.Room{
			Slug:  "lobby",
			Name:  "The Lobby",
			Topic: "Welcome to the lobby",
		})
	}

	h := Handler{db}

	server := celerity.New()

	server.Use(middleware.RequestLogger())
	server.Pre(middleware.CORS())

	server.Channel("chat", "/ws/:token", h.SocketHandler)

	secured := server.Scope("/")
	secured.Use(middleware.Aegis(middleware.AegisConfig{
		Adapter: AegisAdapter{db},
	}))
	secured.POST("/rooms", h.CreateRoom)
	secured.GET("/rooms/:slug", h.GetRoom)
	secured.GET("/validate", h.ValidateSession)

	server.POST("/signup", h.CreateUser)
	server.POST("/login", h.Login)

	server.ServePath("/", "./frontend/build")
	server.ServeFile("*", "./frontend/build/index.html")

	return server
}

// AegisAdapter is the adapter for the authorization middleware
type AegisAdapter struct {
	DB *gorm.DB
}

// ValidateSession validation function
func (aa AegisAdapter) ValidateSession(c celerity.Context, token string) bool {
	// look up the session token and return some kind of user structure
	var session models.Session
	if aa.DB.
		Preload("User").
		Where("token = ?", token).
		First(&session).RecordNotFound() {
		return false
	}
	// set the user in the context so route handlers can extract it
	c.Set("session", &session)
	return true
}
