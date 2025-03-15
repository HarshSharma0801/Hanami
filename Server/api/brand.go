package api

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (server *Server) get_brand_by_user_id(ctx *gin.Context) {
	userIDParam := ctx.Param("id")
	userId, err := strconv.ParseInt(userIDParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	convertedUserID := sql.NullInt64{
		Valid: true,
		Int64: userId,
	}

	brand, err := server.store.Get_Brand_By_UserID(ctx, convertedUserID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"brand": brand})
}
