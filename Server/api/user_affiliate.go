package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type create_user_affiliate_params struct {
	Username string `json:"username,omitempty" binding:"required"`
	Password string `json:"password,omitempty" binding:"required"`
	Email    string `json:"email,omitempty" binding:"required"`
}

func (server *Server) create_user_affiliate(ctx *gin.Context) {

	var req *create_user_affiliate_params

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	exists, err := server.store.User_Exists_By_Email(ctx, req.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if exists {
		ctx.JSON(http.StatusConflict, gin.H{"error": "user affiliate with this email already exists"})
		return
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	args := sqlc.Create_User_AffiliateParams{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashedPassword,
	}

	id, err := server.store.Create_User_Affiliate(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	convertedID := sql.NullInt64{
		Int64: id,
		Valid: true,
	}

	user_id, err := server.store.Create_Affiliate(ctx, convertedID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	log.Printf("New User Affiliate Created : %v", user_id)

	ctx.JSON(http.StatusOK, user_id)

}
