package util

// CalculateUShapedWeights computes weights for trackers using the U-Shaped (Position-Based) attribution model.
// - 40% to the first tracker
// - 40% to the last tracker
// - 20% distributed equally among the middle trackers
// Edge cases:
// - 1 tracker: 100% weight
// - 2 trackers: 40% first, 40% last (20% ignored since no middle trackers)
func CalculateUShapedWeights(numTrackers int) []float64 {
	weights := make([]float64, numTrackers)

	if numTrackers == 0 {
		return weights 
	}

	if numTrackers == 1 {
		weights[0] = 1.0
		return weights
	}

	// U-Shaped model
	weights[0] = 0.4 // 40% to first
	weights[numTrackers-1] = 0.4 // 40% to last

	if numTrackers == 2 {
		return weights
	}

	middleTrackers := numTrackers - 2
	middleWeight := 0.2 / float64(middleTrackers)
	for i := 1; i < numTrackers-1; i++ {
		weights[i] = middleWeight
	}

	return weights
}