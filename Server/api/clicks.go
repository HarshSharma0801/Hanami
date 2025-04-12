package api

import (
	"Hanami/sqlc"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Tracker struct {
	TrackingCode string    `json:"tracking_code"`
	ClickID      string    `json:"click_id"`
	UtmSource    string    `json:"utm_source,omitempty"`
	UtmMedium    string    `json:"utm_medium,omitempty"`
	Timestamp    time.Time `json:"timestamp"`
}

type SessionData struct {
	SessionID string    `json:"session_id"`
	Trackers  []Tracker `json:"trackers"`
}

func (server *Server) redirect_user(ctx *gin.Context) {
	// Extract referer and parse domain
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

	// Validate tracking_code
	linkCode := ctx.Query("tracking_code")
	if linkCode == "" {
		log.Printf("Missing tracking_code parameter")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tracking_code query parameter is required"})
		return
	}

	// Get UTM parameters
	utmSource := ctx.Query("utm_source")
	utmMedium := ctx.Query("utm_medium")

	// Fetch tracking link
	tracking_link, err := server.store.Get_TrackingLink_By_Link_Code(ctx, linkCode)
	if err != nil {
		log.Printf("Failed to find tracking link for code %s: %v", linkCode, err)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Tracking link not found"})
		return
	}

	// Generate click ID and capture user details
	clickID := uuid.New()
	userIP := ctx.ClientIP()
	if userIP == "" {
		log.Printf("Unable to determine client IP")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to determine client IP"})
		return
	}
	userAgent := ctx.Request.UserAgent()

	// Prepare click parameters
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

	// Log click
	click, err := server.store.Create_Click(ctx, click_args)
	if err != nil {
		log.Printf("Failed to create click for tracking link %d: %v", tracking_link.ID, err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record click"})
		return
	}

	// Fetch campaign
	campaign, err := server.store.Get_Campaign(ctx, tracking_link.CampaignID.Int64)
	if err != nil {
		log.Printf("Failed to find campaign %d: %v", tracking_link.CampaignID.Int64, err)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
		return
	}

	// Ensure landing URL is HTTPS
	landingURL := campaign.LandingUrl
	if !strings.HasPrefix(landingURL, "http://") && !strings.HasPrefix(landingURL, "https://") {
		landingURL = "https://" + landingURL
	}
	landingURL = strings.Replace(landingURL, "http://", "https://", 1) // Force HTTPS

	// Parse and validate landing URL
	parsedLandingURL, err := url.Parse(landingURL)
	if err != nil {
		log.Printf("Failed to parse landing URL %s: %v", landingURL, err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid landing URL"})
		return
	}

	// Validate hostname
	if parsedLandingURL.Hostname() == "" || strings.Contains(parsedLandingURL.Hostname(), "..") {
		log.Printf("Invalid landing URL hostname: %s", parsedLandingURL.Hostname())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid landing URL hostname"})
		return
	}

	// Manage session data
	var sessionData SessionData
	existingCookie, _ := ctx.Cookie("promo_tracking_session")
	if existingCookie != "" {
		err := json.Unmarshal([]byte(existingCookie), &sessionData)
		if err != nil {
			log.Printf("Failed to parse existing cookie: %v", err)
			sessionData.SessionID = uuid.New().String()
		}
	} else {
		sessionData.SessionID = uuid.New().String()
	}

	// Add new tracker
	newTracker := Tracker{
		TrackingCode: linkCode,
		ClickID:      clickID.String(),
		UtmSource:    utmSource,
		UtmMedium:    utmMedium,
		Timestamp:    time.Now().UTC(),
	}

	// Limit trackers to prevent cookie size issues
	const maxTrackers = 10
	if len(sessionData.Trackers) >= maxTrackers {
		sessionData.Trackers = sessionData.Trackers[len(sessionData.Trackers)-maxTrackers+1:]
	}
	sessionData.Trackers = append(sessionData.Trackers, newTracker)

	// Serialize session data
	sessionDataJSON, err := json.Marshal(sessionData)
	if err != nil {
		log.Printf("Failed to serialize session data: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process session data"})
		return
	}

	// Set cookie domain and flags
	domain := parsedLandingURL.Hostname()
	secure := true
	if os.Getenv("ENVIRONMENT") == "DEV" {
		domain = "localhost"
		secure = false
	} else {
		// Allow subdomains (e.g., .reservify.vercel.app)
		if !strings.HasPrefix(domain, ".") {
			domain = "." + domain
		}
	}

	// Log cookie details for debugging
	log.Printf("Setting cookie: name=promo_tracking_session, domain=%s, secure=%v, size=%d bytes, value=%s", domain, secure, len(sessionDataJSON), string(sessionDataJSON))

	// Set cookie with all attributes in one header
	cookieValue := url.QueryEscape(string(sessionDataJSON))
	cookieHeader := fmt.Sprintf(
		"promo_tracking_session=%s; Domain=%s; Path=/; Max-Age=%d; HttpOnly; %sSameSite=None",
		cookieValue,
		domain,
		30*24*60*60,
		func() string {
			if secure {
				return "Secure; "
			}
			return ""
		}(),
	)
	ctx.Writer.Header().Set("Set-Cookie", cookieHeader)

	// Prepare redirect
	redirectURL := fmt.Sprintf("%s?click_id=%s", landingURL, click.ClickID.String())
	log.Printf("Redirecting to: %s", redirectURL)

	// Perform redirect
	ctx.Redirect(http.StatusFound, redirectURL)
}

