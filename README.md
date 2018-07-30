This project is an example using the celerity framework
(http://celerity.5sigma.io).

This example includes:

- A real time chat application using web sockets utilizing celerity's channels
- Basic user authentication and registration
- Secured and unsecured routes using middleware
- Multiple independent chat rooms utilizing celerity's channel rooms
- A ReactJS front end served from server
- A ReactJS Context implementation to handle web socket communication


# Running this example:

1. Clone the repository with `git clone https://github.com/5Sigma/celerity-example-chat.git`
3. Install dependencies using Dep: `dep ensure` (if you dont have GoDep installed see https://github.com/golang/dep)
2. Run the main server `go run main.go`
3. Direct a browser to the application running at: http://localhost:5050/
