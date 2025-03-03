package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router     *gin.Engine
	store      *sqlc.Store
	config     util.Config
	tokenMaker util.Maker
}

func NewServer(store *sqlc.Store, config util.Config) (*Server, error) {

	tokenMaker, err := util.NewPasetoMaker(config.TokenSymmetricKey)
	if err != nil {
		return nil, err
	}
	server := &Server{store: store, config: config, tokenMaker: tokenMaker}

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
	router.POST("/api/user/affiliate/login", server.login_user_affiliate)
	router.POST("/api/user/brand/login", server.login_user_brand)

	//Campaign
	router.POST("/api/brand/campaign/new", server.create_campaign)
	router.GET("/api/campaign/:id", server.get_campaign_by_id)
	router.GET("/api/brand/campaign/:id", server.get_campaign_by_brandId)
	router.DELETE("/api/campaign/:id", server.delete_campaign_by_id)

	//Campaign-Affiliate
	router.POST("/api/brand/campaign/affiliate", server.create_campaign_affiliate)

	server.router = router

	return server, nil

}

func (server *Server) Init(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
