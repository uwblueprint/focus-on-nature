import { getBearerToken } from "../constants/AuthConstants";
import {
  CampResponse,
  CampSessionResponse,
  CreateUpdateCampRequest,
  CreateUpdateCampResponse,
  UpdateCampSessionsRequest,
} from "../types/CampsTypes";
import baseAPIClient from "./BaseAPIClient";

const getAllCamps = async (year?: number): Promise<Array<CampResponse>> => {
  try {
    const { data } = await baseAPIClient.get(
      `/camp?campYear=${year?.toString()}`,
      {
        headers: { Authorization: getBearerToken() },
      },
    );
    return data;
  } catch (error) {
    return error as CampResponse[];
  }
};

const getCampById = async (id: string): Promise<CampResponse> => {
  try {
    const { data } = await baseAPIClient.get(`/camp/${id}`, {
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error) {
    return error as CampResponse;
  }
};

const createNewCamp = async (
  camp: CreateUpdateCampRequest,
): Promise<CreateUpdateCampResponse> => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(camp));

    const { data } = await baseAPIClient.post("/camp", formData, {
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error: unknown) {
    return error as CreateUpdateCampResponse;
  }
};

const editCampById = async (
  id: string,
  camp: CreateUpdateCampRequest,
): Promise<CreateUpdateCampResponse> => {
  try {

    const fieldsToUpdate: CreateUpdateCampRequest = { ...camp };

    const formData = new FormData();
    formData.append("data", JSON.stringify(fieldsToUpdate));
    const { data } = await baseAPIClient.patch(`/camp/${id}`, formData, {
      headers: {
        Authorization: getBearerToken(),
      },
    });
    return data;
  } catch (error) {
    return error as CreateUpdateCampResponse;
  }
};

const deleteCamp = async (id: string): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/camp/${id}`, {
      headers: { Authorization: getBearerToken() },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const updateCampSessions = async (
  campId: string,
  updatedCampSessions: Array<UpdateCampSessionsRequest>,
): Promise<Array<CampSessionResponse>> => {
  try {
    const { data } = await baseAPIClient.patch(`/camp/${campId}/session`, {
      headers: {
        Authorization: getBearerToken(),
      },
      data: {
        updatedCampSessions,
      },
    });

    return data;
  } catch (error) {
    return error as Array<CampSessionResponse>;
  }
};

const deleteCampSessionsByIds = async (
  campId: string,
  campSessionIds: Array<string>,
): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/camp/${campId}/session`, {
      headers: {
        Authorization: getBearerToken(),
      },
      data: {
        campSessionIds,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getCampSessionCsv = async (id: string): Promise<string> => {
  try {
    const { data } = await baseAPIClient.get(`/camp/csv/${id}`, {
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error) {
    return "ERROR";
  }
};

export default {
  getAllCamps,
  getCampById,
  createNewCamp,
  editCampById,
  deleteCamp,
  updateCampSessions,
  deleteCampSessionsByIds,
  getCampSessionCsv,
};
