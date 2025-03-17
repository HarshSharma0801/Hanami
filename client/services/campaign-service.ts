import { ICreateCampaign } from "@/sdk/types";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getCampaignsByBrandId = async (brandId: string) => {
  try {
    const response = await axios.get(`/api/brand/campaign/${brandId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCampaignsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`/api/affiliate/campaign/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCampaignsById = async (id: string) => {
  try {
    const response = await axios.get(`/api/campaign/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCampaign = async (values: ICreateCampaign) => {
  try {
    const response = await axios.post(`/api/brand/campaign/new`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
