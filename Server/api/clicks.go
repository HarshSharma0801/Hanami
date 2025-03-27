package api

import (
	"Promotopia/sqlc"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
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

	utmSource := ctx.Query("utm_source")
	utmMedium := ctx.Query("utm_medium")

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

	parsedLandingURL, err := url.Parse(landingURL)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse landing URL"})
		return
	}

	var sessionData SessionData
    existingCookie, _ := ctx.Cookie("promo_tracking_session")
    if existingCookie != "" {
        err := json.Unmarshal([]byte(existingCookie), &sessionData)
        if err != nil {
            sessionData.SessionID = uuid.New().String()
        }
    } else {
        sessionData.SessionID = uuid.New().String()
    }

    newTracker := Tracker{
        TrackingCode: linkCode,
        ClickID:      clickID.String(),
        UtmSource:    utmSource,
        UtmMedium:    utmMedium,
        Timestamp:    time.Now().UTC(),
    }
    sessionData.Trackers = append(sessionData.Trackers, newTracker)

    sessionDataJSON, err := json.Marshal(sessionData)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize session data"})
        return
    }

    domain := parsedLandingURL.Hostname() 
    secure := true
    if server.config.ENVIRONMENT == "DEV" {
		domain = "localhost"
        secure = false
    }

    ctx.SetCookie(
        "promo_tracking_session",
        string(sessionDataJSON),
        30*24*60*60,
        "/",
        domain,
        secure,
        true,
    )
	redirectURL := fmt.Sprintf("%s?click_id=%s", landingURL, click.ClickID.String())
	ctx.Redirect(http.StatusFound, redirectURL)

}
