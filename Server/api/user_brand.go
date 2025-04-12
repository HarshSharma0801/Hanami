package api

import (
	"Hanami/sqlc"
	"Hanami/util"
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type create_user_brand_params struct {
	Username    string `json:"username,omitempty" binding:"required"`
	Password    string `json:"password,omitempty" binding:"required"`
	Email       string `json:"email,omitempty" binding:"required"`
	CompanyName string `json:"company_name,omitempty" binding:"required"`
	Website     string `json:"website,omitempty" binding:"required"`
}

type login_user_brand_params struct {
	Password string `json:"password,omitempty" binding:"required"`
	Email    string `json:"email,omitempty" binding:"required"`
}

type login_user_brand_res struct {
	SessionID             uuid.UUID      `json:"session_id,omitempty"`
	AccessToken           string         `json:"access_token,omitempty"`
	AccessTokenExpiresAt  time.Time      `json:"access_token_expires_at,omitempty"`
	RefreshToken          string         `json:"refresh_token,omitempty"`
	RefreshTokenExpiresAt time.Time      `json:"refresh_token_expires_at,omitempty"`
	User                  login_user_res `json:"user,omitempty"`
}

func (server *Server) create_user_brand(ctx *gin.Context) {

	var req *create_user_brand_params

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
		ctx.JSON(http.StatusConflict, gin.H{"error": "user brand with this email already exists"})
		return
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	args := sqlc.Create_User_BrandParams{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashedPassword,
	}

	id, err := server.store.Create_User_Brand(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	convertedID := sql.NullInt64{
		Int64: id,
		Valid: true,
	}

	convertedWebsite := sql.NullString{
		String: req.Website,
		Valid:  true,
	}

	brandArgs := sqlc.Create_BrandParams{
		UserID:      convertedID,
		CompanyName: req.CompanyName,
		Website:     convertedWebsite,
	}

	user_id, err := server.store.Create_Brand(ctx, brandArgs)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	log.Printf("New User Brand Created : %v", user_id)

	ctx.JSON(http.StatusOK, user_id)
}

func (server *Server) login_user_brand(ctx *gin.Context) {

	var req login_user_brand_params

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

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(user.Username, time.Minute*15, user.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	refreshToken, refreshPayload, err := server.tokenMaker.CreateToken(user.Username, time.Hour*12*60, user.Email)
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

	response := &login_user_brand_res{
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
