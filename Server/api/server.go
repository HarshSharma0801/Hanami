package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
	store  *sqlc.Store
	config util.Config
}

func NewServer(store *sqlc.Store, config util.Config) (*Server, error) {

	server := &Server{store: store, config: config}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	//User
	router.POST("/api/user/affiliate", server.create_user_affiliate)
	router.POST("/api/user/brand", server.create_user_brand)

	server.router = router

	return server, nil

}

func (server *Server) Init(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
