package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type campaign_affiliate_params struct {
	CampaignID       int64 `json:"campaign_id,omitempty"`
	User_AffiliateID int64 `json:"user_affiliate_id,omitempty"`
}

func (server *Server) create_campaign_affiliate(ctx *gin.Context) {

	var req campaign_affiliate_params

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	user_affiliate, err := server.store.User_Affiliate_Exists_By_Id(ctx, req.User_AffiliateID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	if !user_affiliate {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user affiliate not found with this id "})
		return
	}

	campaign, err := server.store.Campaign_Exists_By_Id(ctx, req.CampaignID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	if !campaign {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "campaign not found with this id "})
		return
	}

	convertedID := sql.NullInt64{
		Int64: req.User_AffiliateID,
		Valid: true,
	}

	affiliates_args := sqlc.Create_AffiliateParams{
		CampaignID: req.CampaignID,
		UserID: convertedID,
	}

	affiliate_id, err := server.store.Create_Affiliate(ctx, affiliates_args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	args := sqlc.Create_Affiliate_CampaignParams{
		CampaignID:  int64(req.CampaignID),
		AffiliateID: affiliate_id,
	}

	campaign_affiliate, err := server.store.Create_Affiliate_Campaign(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
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
		Int64: affiliate_id,
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

	ctx.JSON(http.StatusOK, gin.H{"campaign": campaign_affiliate.CreatedAt, "link": tracking_link})
}
