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

const editCampById = async (
  id: string,
  camp: CampResponse,
): Promise<CampResponse> => {
  try {
    // formquestions and campsessions are edited separately
    const fieldsToUpdate: Partial<CampResponse> = { ...camp };
    delete fieldsToUpdate.formQuestions;
    delete fieldsToUpdate.campSessions;

    const formData = new FormData();
    formData.append("data", JSON.stringify(fieldsToUpdate));
    const { data } = await baseAPIClient.patch(`/camp/${id}`, formData, {
      headers: {
        Authorization: BEARER_TOKEN,
      },
    });
    return data;
  } catch (error) {
    return error as CampResponse;
  }
};

const deleteCamp = async (id: string): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/camp/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  getCampById,
  editCampById,
  deleteCamp,
};
