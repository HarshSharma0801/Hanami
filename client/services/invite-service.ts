import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

interface ICreateInvite {
  campaign_id: number;
  email: string;
}

export const create_invite = async (values: ICreateInvite) => {
  try {
    const response = await axios.post(`/api/brand/campaign/invite`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getInvitesByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`/api/brand/campaign/invite/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

interface ICreateResponse {
  invite_id: number;
  status: string;
  user_affiliate_id: number;
}

export const createResponse = async (values: ICreateResponse) => {
  try {
    const response = await axios.post(`/api/brand/campaign/affiliate`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
