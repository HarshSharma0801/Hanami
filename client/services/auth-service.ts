import axios from "axios";



axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface IRegisterBrand {
  username: string;
  password: string;
  email: string;
  company_name: string;
  website: string;
}

export interface IRegisterAffiliate {
  username: string;
  password: string;
  email: string;
}

export const registerBrand = async (values: IRegisterBrand) => {
  try {
    const response = await axios.post("/api/user/brand", values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const registerAffiliate = async (values: IRegisterAffiliate) => {
  try {
    const response = await axios.post("/api/user/affiliate", values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
