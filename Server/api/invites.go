package api

import (
	"Hanami/sqlc"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type sendInviteRequest struct {
	CampaignID int64  `json:"campaign_id,omitempty"`
	Email      string `json:"email,omitempty"`
}

func (server *Server) send_invite(ctx *gin.Context) {

	var req sendInviteRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	user, err := server.store.Get_User_By_Email(ctx, req.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	affiliate_args := sqlc.Check_Affiliate_By_UserID_CampaignIDParams{
		CampaignID: req.CampaignID,
		UserID: sql.NullInt64{
			Valid: true,
			Int64: user.ID,
		},
	}

	affiliate, err := server.store.Check_Affiliate_By_UserID_CampaignID(ctx, affiliate_args)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if affiliate {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "affiliate already present to this user for this campaign"})
		return
	}

	invite_arg := sqlc.Check_InviteParams{
		CampaignID: req.CampaignID,
		UserID:     user.ID,
	}

	existingInvite, err := server.store.Check_Invite(ctx, invite_arg)
	if existingInvite {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invite already sent to this user for this campaign"})
		return
	}
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	args := sqlc.Create_InviteParams{
		CampaignID: req.CampaignID,
		UserID:     user.ID,
	}

	invite, err := server.store.Create_Invite(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invite"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"invite": invite})
}

func (server *Server) get_invites_by_user_id(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	userId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	invites, err := server.store.Get_Pending_Invites_By_UserID(ctx, userId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, invites)

}
