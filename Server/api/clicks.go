package api

import (
	"Hanami/sqlc"
	"database/sql"
	"fmt"
	"log"
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
			log.Printf("Invalid Referer URL: %v", err)
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Referer URL"})
			return
		}
		refererDomain = parsedURL.Host
	} else {
		refererDomain = "unknown"
	}

	linkCode := ctx.Query("tracking_code")
	if linkCode == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tracking_code query parameter is required"})
		return
	}

	utmSource := ctx.Query("utm_source")
	utmMedium := ctx.Query("utm_medium")

	tracking_link, err := server.store.Get_TrackingLink_By_Link_Code(ctx, linkCode)
	if err != nil {
		log.Printf("Failed to find tracking link for code %s: %v", linkCode, err)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Tracking link not found"})
		return
	}

	clickID := uuid.New()
	userIP := ctx.ClientIP()
	if userIP == "" {
		log.Printf("Unable to determine client IP")
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
		UtmSource: sql.NullString{
			String: utmSource,
			Valid:  utmSource != "",
		},
		UtmMedium: sql.NullString{
			String: utmMedium,
			Valid:  utmMedium != "",
		},
	}

	click, err := server.store.Create_Click(ctx, click_args)
	if err != nil {
		log.Printf("Failed to create click for tracking link %d: %v", tracking_link.ID, err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record click"})
		return
	}

	log.Printf("New Click %s", click.ClickID)

	campaign, err := server.store.Get_Campaign(ctx, tracking_link.CampaignID.Int64)
	if err != nil {
		log.Printf("Failed to find campaign %d: %v", tracking_link.CampaignID.Int64, err)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
		return
	}

	landingURL := campaign.LandingUrl
	if !strings.HasPrefix(landingURL, "http://") && !strings.HasPrefix(landingURL, "https://") {
		landingURL = "https://" + landingURL
	}
	landingURL = strings.Replace(landingURL, "http://", "https://", 1) // Force HTTPS

	parsedLandingURL, err := url.Parse(landingURL)
	if err != nil {
		log.Printf("Failed to parse landing URL %s: %v", landingURL, err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid landing URL"})
		return
	}

	if parsedLandingURL.Hostname() == "" || strings.Contains(parsedLandingURL.Hostname(), "..") {
		log.Printf("Invalid landing URL hostname: %s", parsedLandingURL.Hostname())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid landing URL hostname"})
		return
	}

	redirectURL := fmt.Sprintf("%s?click_id=%s", landingURL, clickID.String())

	redirectURL = fmt.Sprintf("%s&tracking_code=%s", redirectURL, url.QueryEscape(linkCode))

	if utmSource != "" {
		redirectURL = fmt.Sprintf("%s&utm_source=%s", redirectURL, url.QueryEscape(utmSource))
	}
	if utmMedium != "" {
		redirectURL = fmt.Sprintf("%s&utm_medium=%s", redirectURL, url.QueryEscape(utmMedium))
	}

	ctx.Redirect(http.StatusFound, redirectURL)
}
