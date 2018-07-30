package main

import (
	"github.com/5Sigma/celerity-example-chat/server"
)

func main() {
	svr := server.Setup()

	println("\n\nServer running at http://localhost:5050/\n")
	println(svr.Start("0.0.0.0:5050").Error())
}
