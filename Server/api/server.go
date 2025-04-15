package api

import (
	"Hanami/sqlc"
	"Hanami/util"
	"os"

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

	tokenMaker, err := util.NewPasetoMaker(os.Getenv("TOKEN_SYMMETRIC_KEY"))
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

	//Brand
	router.GET("/api/user/brand/:id", server.get_brand_by_user_id)

	//Affiliates
	router.GET("/api/affiliates/campaign/:id", server.get_affiliates_by_campaign_id)
	router.GET("/api/affiliates/check", server.check_affiliate_by_email)

	//Campaign
	router.POST("/api/brand/campaign/new", server.create_campaign)
	router.GET("/api/campaign/:id", server.get_campaign_by_id)
	router.GET("/api/brand/campaign/:id", server.get_campaign_by_brandId)
	router.GET("/api/affiliate/campaign/:id", server.get_campaign_for_affiliate)
	router.DELETE("/api/campaign/:id", server.delete_campaign_by_id)

	//Invite
	router.POST("/api/brand/campaign/invite", server.send_invite)
	router.GET("/api/brand/campaign/invite/:id", server.get_invites_by_user_id)

	//Campaign-Affiliate
	router.POST("/api/brand/campaign/affiliate", server.create_campaign_affiliate)

	//Tracking-Link
	router.POST("/api/brand/campaign/tracking/new", server.create_tracking_link)
	router.GET("/api/brand/campaign/tracking/:id", server.get_tracking_link_by_id)
	router.GET("/api/campaign/tracking/:id", server.get_tracking_links_by_campaign_id)
	router.GET("/api/affiliate/tracking/:id", server.get_tracking_links_by_affiliate_id)
	router.POST("/api/brand/campaign/tracking/:id", server.delete_tracking_link_by_id)
	router.GET("/api/campaign/affiliate/tracking", server.get_tracking_link_for_affiliate)

	//Redirect-URL-MAIN
	router.GET("/", server.redirect_user)

	//Conversions
	router.POST("/api/conversion", server.create_conversion)

	//Analytics
	router.GET("/api/keymetrics", server.get_Brand_Key_Metrics)
	router.GET("/api/campaignPerformance", server.get_Brand_Campaign_Performance)
	router.GET("/api/revenue", server.get_Brand_Revenue)
	router.GET("/api/utm", server.get_Brand_UTM_Performance)
	router.GET("/api/campaignEffectiveness", server.get_CampaignEffectiveness)
	router.GET("/api/metricsTime", server.get_MetricsOverTime)
	router.GET("/api/campaignSpecific", server.get_Campaign_Specific)
	router.GET("/api/revenueDetails", server.get_Revenue_Details)
	
	// New consolidated tab-based analytics endpoints
	router.GET("/api/analytics/campaign-analysis", server.getCampaignAnalysisTabData)
	router.GET("/api/analytics/audience-insights", server.getAudienceInsightsTabData)
	router.GET("/api/analytics/revenue-stats", server.getRevenueStatsTabData)

	server.router = router

	return server, nil

}

func (server *Server) Init(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
