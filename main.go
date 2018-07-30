package main

import (
	"github.com/5Sigma/celerity-examples/chat/server"
)

func main() {
	svr := server.Setup()

	svr.Start("0.0.0.0:5050")
}
