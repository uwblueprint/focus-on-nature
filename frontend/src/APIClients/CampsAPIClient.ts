import { BEARER_TOKEN } from "../constants/AuthConstants";
import { Camp } from "../types/CampsTypes";
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

const editCampById = async (id: string, camp: Camp): Promise<Camp> => {
  try {
    // Explicity writing out the fields to update since formquestions and campsessions are omitted
    const fieldsToUpdate = { ...camp };
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
    return error as Camp;
  }
};

export default {
  getCampById,
  editCampById,
};
