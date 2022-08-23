import { BEARER_TOKEN } from "../constants/AuthConstants";
import { CampResponse } from "../types/CampsTypes";
import baseAPIClient from "./BaseAPIClient";

const getCampById = async (id: string): Promise<CampResponse> => {
  try {
    const { data } = await baseAPIClient.get(`/camp/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as CampResponse;
  }
};

export default {
  getCampById,
};
