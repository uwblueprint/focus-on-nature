import { BEARER_TOKEN } from "../constants/AuthConstants";
import { Camp, EditCampDataType } from "../types/CampsTypes";
import baseAPIClient from "./BaseAPIClient";

const getCampById = async (id: string): Promise<Camp> => {
  try {
    const { data } = await baseAPIClient.get(`/camp/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Camp;
  }
};

const editCampById = async (
  id: string,
  campData: EditCampDataType,
): Promise<Camp> => {
  try {
    const { data } = await baseAPIClient.patch(`/camp/${id}`, campData, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Camp;
  }
};

export default {
  getCampById,
  editCampById,
};
