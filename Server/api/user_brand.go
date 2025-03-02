package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type create_user_brand_params struct {
	Username    string `json:"username,omitempty" binding:"required"`
	Password    string `json:"password,omitempty" binding:"required"`
	Email       string `json:"email,omitempty" binding:"required"`
	CompanyName string `json:"company_name,omitempty" binding:"required"`
	Website     string `json:"website,omitempty" binding:"required"`
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
