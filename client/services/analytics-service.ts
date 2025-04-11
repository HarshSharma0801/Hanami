import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getKeyMetrics = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/keymetrics`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.keyMetrics;
  } catch (error) {
    console.log(error);
  }
};

export const getCampaignPerformance = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/campaignPerformance`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.performance;
  } catch (error) {
    console.log(error);
  }
};

export const getRevenue = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/revenue`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.revenueData;
  } catch (error) {
    console.log(error);
  }
};

export const getUTM = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/utm`, {
      params: {
        brandId: brandId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};



export const getCampaignEffectiveness = async (brandId: string) => {
    try {
      const response = await axios.get(`/api/campaignEffectiveness`, {
        params: {
          brandId: brandId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.effectiveness;
    } catch (error) {
      console.log(error);
    }
  };

  export const getCampaignSpecificEffectiveness = async (brandId: string) => {
    try {
      const response = await axios.get(`/api/campaignSpecific`, {
        params: {
          brandId: brandId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.metrics;
    } catch (error) {
      console.log(error);
    }
  };


  export const getMetricTime = async (brandId: string) => {
    try {
      const response = await axios.get(`/api/metricsTime`, {
        params: {
          brandId: brandId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.metrics;
    } catch (error) {
      console.log(error);
    }
  };