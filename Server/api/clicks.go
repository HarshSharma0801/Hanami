package api

import (
	"Promotopia/sqlc"
	"database/sql"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (server *Server) redirect_user(ctx *gin.Context) {

	referer := ctx.Request.Header.Get("Referer")
	var refererDomain string
	if referer != "" {
		parsedURL, err := url.Parse(referer)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Referer URL"})
			return
		}
		refererDomain = parsedURL.Host
	} else {
		refererDomain = "unknown"
	}

	linkCode := ctx.Query("tracking_code")
	if linkCode == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "link_code query parameter is required"})
		return
	}

	tracking_link, err := server.store.Get_TrackingLink_By_Link_Code(ctx, linkCode)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "link not found with this code"})
		return
	}

	clickID := uuid.New()

	userIP := ctx.ClientIP()
	if userIP == "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to determine client IP"})
		return
	}
	userAgent := ctx.Request.UserAgent()

	click_args := sqlc.Create_ClickParams{
		TrackingLinkID: sql.NullInt64{
			Int64: tracking_link.ID,
			Valid: true,
		},
		ClickID: clickID,
		UserIp:  userIP,
		UserAgent: sql.NullString{
			String: userAgent,
			Valid:  userAgent != "",
		},
		Referrer: sql.NullString{
			String: refererDomain,
			Valid:  refererDomain != "",
		},
	}

	click, err := server.store.Create_Click(ctx, click_args)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	campaign, err := server.store.Get_Campaign(ctx, tracking_link.CampaignID.Int64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	landingURL := campaign.LandingUrl
	if !strings.HasPrefix(landingURL, "http://") && !strings.HasPrefix(landingURL, "https://") {
		landingURL = "https://" + landingURL
	}

	redirectURL := fmt.Sprintf("%s?click_id=%s", landingURL, click.ClickID.String())
	ctx.Redirect(http.StatusFound, redirectURL)

}
