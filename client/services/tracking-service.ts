import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getTrackingCodeForAffiliate = async (
  campaignId: string,
  userId: string
) => {
  try {
    const response = await axios.get(`/api/campaign/affiliate/tracking`, {
      params: {
        campaign_id: campaignId,
        user_id: userId,
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
