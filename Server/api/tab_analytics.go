package api

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Handler for the Campaign Analysis Tab data
func (server *Server) getCampaignAnalysisTabData(ctx *gin.Context) {
	id := ctx.Query("brandId")

	brandId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid brand ID format"})
		return
	}

	convertedId := sql.NullInt64{
		Int64: brandId,
		Valid: true,
	}

	// Get campaign effectiveness data
	effectiveness, err := server.store.Get_CampaignEffectiveness(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get campaign effectiveness: " + err.Error()})
		return
	}

	// Get campaign specific effectiveness data
	campaignSpecific, err := server.store.GetCampaign_Specific_Effectiveness(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get campaign specific data: " + err.Error()})
		return
	}

	// Get metrics over time data
	metricsTime, err := server.store.Get_MetricsOverTime(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get metrics over time: " + err.Error()})
		return
	}

	// Return all data in a single response
	ctx.JSON(http.StatusOK, gin.H{
		"effectiveness": effectiveness,
		"campaignSpecific": campaignSpecific,
		"metricsTime": metricsTime,
	})
}

// Handler for the Audience Insights Tab data
func (server *Server) getAudienceInsightsTabData(ctx *gin.Context) {
	id := ctx.Query("brandId")

	brandId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid brand ID format"})
		return
	}

	convertedId := sql.NullInt64{
		Int64: brandId,
		Valid: true,
	}

	// Get UTM source data
	utmSource, err := server.store.Get_UTMSource_Counts(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get UTM source data: " + err.Error()})
		return
	}

	// Get UTM medium data
	utmMedium, err := server.store.Get_UTMMedium_Counts(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get UTM medium data: " + err.Error()})
		return
	}

	// Mock data for audience breakdown (would be replaced with real data in production)
	audienceBreakdown := []map[string]interface{}{
		{"name": "Age 18-24", "value": 15},
		{"name": "Age 25-34", "value": 35},
		{"name": "Age 35-44", "value": 25},
		{"name": "Age 45-54", "value": 15},
		{"name": "Age 55+", "value": 10},
	}

	// Mock data for geographic distribution (would be replaced with real data in production)
	geographicDistribution := []map[string]interface{}{
		{"name": "United States", "value": 45},
		{"name": "United Kingdom", "value": 15},
		{"name": "Canada", "value": 10},
		{"name": "Australia", "value": 8},
		{"name": "Germany", "value": 7},
		{"name": "France", "value": 5},
		{"name": "Other", "value": 10},
	}

	// Mock data for device stats (would be replaced with real data in production)
	deviceStats := []map[string]interface{}{
		{"name": "Mobile", "value": 55},
		{"name": "Desktop", "value": 35},
		{"name": "Tablet", "value": 10},
	}

	// Return all data in a single response
	ctx.JSON(http.StatusOK, gin.H{
		"utmSource": utmSource,
		"utmMedium": utmMedium,
		"audienceBreakdown": audienceBreakdown,
		"geographicDistribution": geographicDistribution,
		"deviceStats": deviceStats,
	})
}

// Handler for the Revenue Stats Tab data
func (server *Server) getRevenueStatsTabData(ctx *gin.Context) {
	id := ctx.Query("brandId")

	brandId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid brand ID format"})
		return
	}

	convertedId := sql.NullInt64{
		Int64: brandId,
		Valid: true,
	}

	// Get key metrics data
	keyMetrics, err := server.store.Get_Brand_Key_Metrics(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get key metrics: " + err.Error()})
		return
	}

	// Get revenue data
	rawRevenueData, err := server.store.Get_Revenue_Data(ctx, brandId)
	if err != nil {
		log.Printf("Failed to fetch raw revenue data: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get revenue data: " + err.Error()})
		return
	}

	// Process revenue data
	var revenueData []map[string]interface{}
	for _, row := range rawRevenueData {
		rawRevenue, err := strconv.ParseFloat(row.RawRevenue, 64)
		if err != nil {
			log.Printf("Failed to parse raw revenue %s: %v", row.RawRevenue, err)
			rawRevenue = 0.0 // Default to 0 if parsing fails
		}

		var baseCurrency string
		if len(row.Currencies) > 0 {
			currStr := string(row.Currencies)
			currencies := strings.Split(currStr, ", ")
			baseCurrency = currencies[0]
			if baseCurrency == "" {
				baseCurrency = "USD"
			}
		} else {
			baseCurrency = "USD"
		}

		usdRevenue := rawRevenue
		rate, exists := exchangeRates[baseCurrency]
		if exists {
			usdRevenue = rawRevenue / rate
		} else {
			log.Printf("Exchange rate not found for currency: %s, using 1.0 as fallback", baseCurrency)
		}

		revenueData = append(revenueData, map[string]interface{}{
			"month":   row.Month,
			"revenue": usdRevenue,
		})
	}

	// Get campaign performance data for revenue by campaign
	campaignPerformance, err := server.store.Get_Campaign_Performance(ctx, convertedId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get campaign performance: " + err.Error()})
		return
	}

	// Create campaign revenue data (simplified for this implementation)
	campaignRevenue := []map[string]interface{}{
		{"campaign": "Summer Sale", "revenue": 42500},
		{"campaign": "Holiday Special", "revenue": 37800},
		{"campaign": "Product Launch", "revenue": 25600},
		{"campaign": "Brand Awareness", "revenue": 12700},
		{"campaign": "Seasonal Promo", "revenue": 18400},
	}

	// Return all data in a single response
	ctx.JSON(http.StatusOK, gin.H{
		"keyMetrics": keyMetrics,
		"revenueData": revenueData,
		"campaignPerformance": campaignPerformance,
		"campaignRevenue": campaignRevenue,
	})
}
