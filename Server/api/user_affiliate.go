package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type create_user_affiliate_params struct {
	Username string `json:"username,omitempty" binding:"required"`
	Password string `json:"password,omitempty" binding:"required"`
	Email    string `json:"email,omitempty" binding:"required"`
}

type login_user_affiliate_params struct {
	Password string `json:"password,omitempty" binding:"required"`
	Email    string `json:"email,omitempty" binding:"required"`
}

type login_user_res struct {
	ID        int64        `json:"id,omitempty"`
	Username  string       `json:"username,omitempty"`
	Email     string       `json:"email,omitempty"`
	Role      string       `json:"role,omitempty"`
	CreatedAt sql.NullTime `json:"created_at,omitempty"`
}

type login_user_affiliate_res struct {
	SessionID             uuid.UUID      `json:"session_id,omitempty"`
	AccessToken           string         `json:"access_token,omitempty"`
	AccessTokenExpiresAt  time.Time      `json:"access_token_expires_at,omitempty"`
	RefreshToken          string         `json:"refresh_token,omitempty"`
	RefreshTokenExpiresAt time.Time      `json:"refresh_token_expires_at,omitempty"`
	User                  login_user_res `json:"user,omitempty"`
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

	log.Printf("New User Affiliate Created : %v", id)

	ctx.JSON(http.StatusOK, id)
}

func (server *Server) login_user_affiliate(ctx *gin.Context) {

	var req login_user_affiliate_params

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	user, err := server.store.Get_User_By_Email(ctx, req.Email)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	err = util.CheckPassword(user.PasswordHash, req.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(user.Username, server.config.AccessTokenDuration, user.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	refreshToken, refreshPayload, err := server.tokenMaker.CreateToken(user.Username, server.config.RefreshTokenDuration, user.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	session, err := server.store.CreateSession(ctx, sqlc.CreateSessionParams{
		ID:           refreshPayload.ID,
		Email:        user.Email,
		RefreshToken: refreshToken,
		UserAgent:    ctx.Request.UserAgent(),
		ClientIp:     ctx.ClientIP(),
		IsBlocked:    false,
		ExpiresAt:    refreshPayload.ExpiredAt,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	response := &login_user_affiliate_res{
		SessionID:             session.ID,
		AccessToken:           accessToken,
		AccessTokenExpiresAt:  accessPayload.ExpiredAt,
		RefreshToken:          refreshToken,
		RefreshTokenExpiresAt: refreshPayload.ExpiredAt,
		User: login_user_res{
			Email:     user.Email,
			Username:  user.Username,
			Role:      user.Role,
			ID:        user.ID,
			CreatedAt: user.CreatedAt,
		},
	}

	ctx.JSON(http.StatusOK, response)

}

func (server *Server) check_affiliate_by_email(ctx *gin.Context) {
	email := ctx.Query("email")
	if email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Email is required"})
		return
	}

	exists, err := server.store.Check_Email_Availability(ctx, email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"available": exists,
	})
}
