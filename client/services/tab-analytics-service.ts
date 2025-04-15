import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches all data needed for the Campaign Analysis tab in a single API call
 * @param brandId The brand ID to fetch data for
 * @returns Object containing effectiveness, campaignSpecific, and metricsTime data
 */
export const getCampaignAnalysisTabData = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/analytics/campaign-analysis`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign analysis data:", error);
    throw error;
  }
};

/**
 * Fetches all data needed for the Audience Insights tab in a single API call
 * @param brandId The brand ID to fetch data for
 * @returns Object containing utmSource, utmMedium, audienceBreakdown, geographicDistribution, and deviceStats data
 */
export const getAudienceInsightsTabData = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/analytics/audience-insights`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching audience insights data:", error);
    throw error;
  }
};

/**
 * Fetches all data needed for the Revenue Stats tab in a single API call
 * @param brandId The brand ID to fetch data for
 * @returns Object containing keyMetrics, revenueData, campaignPerformance, and campaignRevenue data
 */
export const getRevenueStatsTabData = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/analytics/revenue-stats`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue stats data:", error);
    throw error;
  }
};

/**
 * Fetches all data needed for the Overview tab in a single API call
 * @param brandId The brand ID to fetch data for
 * @returns Object containing keyMetrics, campaignPerformance, revenueData, and utm data
 */
export const getOverviewTabData = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/analytics/overview`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    throw error;
  }
};
