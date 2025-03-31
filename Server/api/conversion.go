package api

import (
	"Promotopia/sqlc"
	"Promotopia/util"
	"database/sql"
	"net/http"
	"sort"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type createConversionRequest struct {
	SessionID string          `json:"session_id" binding:"required"`
	Trackers  []trackerParams `json:"trackers" binding:"required,dive"`
	Amount    float64         `json:"amount" binding:"required,gt=0"`
	Currency  string          `json:"currency" binding:"required,oneof=USD INR EUR GBP JPY CAD AUD"`
}

type trackerParams struct {
	ClickID      string    `json:"click_id" binding:"required,uuid"`
	TrackingCode string    `json:"tracking_code" binding:"required"`
	UtmSource    string    `json:"utm_source"`
	UtmMedium    string    `json:"utm_medium"`
	Timestamp    time.Time `json:"timestamp" binding:"required"`
}

func (server *Server) create_conversion(ctx *gin.Context) {
	var req createConversionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	if len(req.Trackers) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "At least one tracker is required"})
		return
	}

	trackers := req.Trackers
	sort.Slice(trackers, func(i, j int) bool {
		return trackers[i].Timestamp.Before(trackers[j].Timestamp)
	})

	weights := util.CalculateUShapedWeights(len(trackers))

	wg := &sync.WaitGroup{}
	mut := &sync.RWMutex{}

	conversions := make([]sqlc.Conversion, 0, len(trackers))
	errChan := make(chan error, len(trackers))
	for i, tracker := range trackers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			clickID, err := uuid.Parse(tracker.ClickID)
			if err != nil {
				errChan <- err
				return
			}

			args := sqlc.Create_ConversionParams{
				ClickID: uuid.NullUUID{
					UUID:  clickID,
					Valid: true,
				},
				Amount: req.Amount,
				Currency: sql.NullString{
					String: req.Currency,
					Valid:  true,
				},
				Weight: sql.NullFloat64{
					Float64: weights[i],
					Valid:   true,
				},
			}

			conversion, err := server.store.Create_Conversion(ctx, args)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, errorResponse(err))
				return
			}
			mut.Lock()
			conversions = append(conversions, conversion)
			mut.Unlock()
		}()
	}

	wg.Wait()
	close(errChan)

	for err := range errChan {
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"conversions": conversions})
}
