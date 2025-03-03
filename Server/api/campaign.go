package api

import (
	"Promotopia/sqlc"
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type create_campaign_params struct {
	Name           string `json:"name,omitempty"`
	Description    string `json:"description,omitempty"`
	CommissionRate string `json:"commission_rate,omitempty"`
	LandingUrl     string `json:"landing_url,omitempty"`
	BrandID        string `json:"brand_id,omitempty"`
}

func (server *Server) create_campaign(ctx *gin.Context) {
	var req create_campaign_params

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	exists, err := server.store.Campaign_Exists_By_Name(ctx, req.Name)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if exists {
		ctx.JSON(http.StatusConflict, gin.H{"error": "campaign with this name already exists"})
		return
	}

	covertedDescription := sql.NullString{
		String: req.Description,
		Valid:  true,
	}

	covertedBrandId, err := strconv.ParseInt(req.BrandID, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	brandId := sql.NullInt64{
		Int64: covertedBrandId,
		Valid: true,
	}


	brand_exists, err := server.store.Brand_Exists_By_Id(ctx, covertedBrandId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if !brand_exists {
		ctx.JSON(http.StatusConflict, gin.H{"error": "brand with this id doesn't exists"})
		return
	}

	args := sqlc.Create_CampaignParams{
		Name:           req.Name,
		Description:    covertedDescription,
		CommissionRate: req.CommissionRate,
		LandingUrl:     req.LandingUrl,
		BrandID:        brandId,
	}

	campaign, err := server.store.Create_Campaign(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	log.Printf("New Campaign Created : %v", campaign.ID)

	ctx.JSON(http.StatusOK, campaign.ID)

}

func (server *Server) get_campaign_by_id(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	campaignID, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	campaign, err := server.store.Get_Campaign(ctx, campaignID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, campaign)

}

func (server *Server) get_campaign_by_brandId(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	convertedID, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	brandID := sql.NullInt64{
		Int64: convertedID,
		Valid: true,
	}

	campaigns, err := server.store.Get_Campaigns_By_Brand(ctx, brandID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, campaigns)

}

func (server *Server) delete_campaign_by_id(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	campaignID, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	err = server.store.DeleteCampaign(ctx, campaignID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"valid": true})

}
