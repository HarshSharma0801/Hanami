package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type create_tracking_link_params struct {
	AffiliateID int64 `json:"affiliate_id,omitempty"`
	CampaignID  int64 `json:"campaign_id,omitempty"`
}

func (server *Server) create_tracking_link(ctx *gin.Context) {

	var req create_tracking_link_params

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
	}

	code, err := util.Generate_Code()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	converted_campaign_id := sql.NullInt64{
		Valid: true,
		Int64: req.CampaignID,
	}

	converted_affiliate_id := sql.NullInt64{
		Valid: true,
		Int64: req.AffiliateID,
	}

	tracking_args := sqlc.Create_TrackingLinkParams{
		AffiliateID: converted_affiliate_id,
		CampaignID:  converted_campaign_id,
		LinkCode:    code,
	}

	tracking_link, err := server.store.Create_TrackingLink(ctx, tracking_args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"link": tracking_link})

}

func (server *Server) get_tracking_link_by_id(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	trackingLink, err := server.store.Get_Tracking_By_Link(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"tracking_link": trackingLink})
}

func (server *Server) get_tracking_links_by_affiliate_id(ctx *gin.Context) {
	affiliateIDParam := ctx.Param("id")
	affiliateID, err := strconv.ParseInt(affiliateIDParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	convertedAffiliateID := sql.NullInt64{
		Valid: true,
		Int64: affiliateID,
	}

	trackingLinks, err := server.store.Get_TrackingLinks_By_Affiliate(ctx, convertedAffiliateID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"tracking_links": trackingLinks})
}

func (server *Server) get_tracking_links_by_campaign_id(ctx *gin.Context) {
	campaignIDParam := ctx.Param("campaign_id")
	campaignID, err := strconv.ParseInt(campaignIDParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	convertedCampaignID := sql.NullInt64{
		Valid: true,
		Int64: campaignID,
	}

	trackingLinks, err := server.store.Get_TrackingLinks_By_Campaign(ctx, convertedCampaignID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"tracking_links": trackingLinks})
}

func (server *Server) delete_tracking_link_by_id(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	err = server.store.Delete_TrackingLink(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Tracking link deleted successfully"})
}

func (server *Server) get_tracking_link_for_affiliate(ctx *gin.Context) {
	campaignIDParam := ctx.Query("campaign_id")
	campaignID, err := strconv.ParseInt(campaignIDParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign_id"})
		return
	}

	convertedCampaignID := sql.NullInt64{
		Valid: true,
		Int64: campaignID,
	}

	userIDParam := ctx.Query("user_id")
	userID, err := strconv.ParseInt(userIDParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user_id"})
		return
	}

	args := sqlc.Get_TrackingLink_For_AffiliateParams{
		CampaignID: convertedCampaignID,
		ID:         userID,
	}

	trackingCode, err := server.store.Get_TrackingLink_For_Affiliate(ctx, args)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Tracking code not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"tracking_code": trackingCode})
}
