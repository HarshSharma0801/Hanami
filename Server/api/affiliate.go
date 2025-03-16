package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (server *Server) get_affiliates_by_campaign_id(ctx *gin.Context) {
	campaignIDParam := ctx.Param("id")
	campaignId, err := strconv.ParseInt(campaignIDParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	affiliates, err := server.store.Get_Affiliates_By_CampaignID(ctx, campaignId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"affiliates": affiliates})
}
