package api

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func (server *Server) get_Brand_Key_Metrics(ctx *gin.Context) {
	id := ctx.Query("brandId")

	brandId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	convertedId := sql.NullInt64{
		Int64: brandId,
		Valid: true,
	}

	metrics, err := server.store.Get_Brand_Key_Metrics(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"keyMetrics": metrics})
}

func (server *Server) get_Brand_Campaign_Performance(ctx *gin.Context) {
	id := ctx.Query("brandId")

	brandId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	convertedId := sql.NullInt64{
		Int64: brandId,
		Valid: true,
	}

	performance, err := server.store.Get_Campaign_Performance(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"performance": performance})
}

var exchangeRates = map[string]float64{
	"USD": 1.0,   // Base currency
	"INR": 0.012, // 1 INR = 0.012 USD
	"EUR": 1.08,
}

func (server *Server) get_Brand_Revenue(ctx *gin.Context) {
	id := ctx.Query("brandId")

	brandId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	rawData, err := server.store.Get_Revenue_Data(ctx, brandId)
	if err != nil {
		log.Printf("Failed to fetch raw revenue data: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var revenueData []struct {
		Month   string  `json:"month"`
		Revenue float64 `json:"revenue"`
	}

	for _, row := range rawData {
		rawRevenue, err := strconv.ParseFloat(row.RawRevenue, 64)
		if err != nil {
			log.Printf("Failed to parse raw revenue %s: %v", row.RawRevenue, err)
			rawRevenue = 0.0 // Default to 0 if parsing fails
		}

		currencies := map[string]bool{}
		if len(row.Currencies) > 0 {
			currStr := string(row.Currencies)
			for _, curr := range strings.Split(currStr, ", ") {
				currencies[curr] = true
			}
		}

		var totalConvertedRevenue float64
		if len(currencies) == 0 {
			totalConvertedRevenue = rawRevenue
		} else {
			totalAmount := rawRevenue
			for curr := range currencies {
				rate, exists := exchangeRates[curr]
				if !exists {
					log.Printf("Exchange rate not found for currency: %s, using 1.0", curr)
					rate = 1.0
				}
				totalConvertedRevenue += (totalAmount / float64(len(currencies))) * rate
			}
		}

		revenueData = append(revenueData, struct {
			Month   string  `json:"month"`
			Revenue float64 `json:"revenue"`
		}{Month: row.Month, Revenue: totalConvertedRevenue})
	}

	ctx.JSON(http.StatusOK, gin.H{"revenueData": revenueData})
}

func (server *Server) get_Brand_UTM_Performance(ctx *gin.Context) {
	id := ctx.Query("brandId")

	brandId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	convertedId := sql.NullInt64{
		Int64: brandId,
		Valid: true,
	}

	utmSource, err := server.store.Get_UTMSource_Counts(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utmMedium, err := server.store.Get_UTMMedium_Counts(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"utmSource": utmSource, "utmMedium": utmMedium})
}
