package main

import (
	"github.com/5Sigma/celerity-examples-chat/server"
)

func main() {
	svr := server.Setup()

	println("\n\nServer running at http://localhost:5050/\n")
	svr.Start("0.0.0.0:5050")
}
