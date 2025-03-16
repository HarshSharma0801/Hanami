import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getAffiliatesByCampaignId = async (campaignId: string) => {
  try {
    const response = await axios.get(`/api/affiliates/campaign/${campaignId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
