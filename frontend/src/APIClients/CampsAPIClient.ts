import { getBearerToken } from "../constants/AuthConstants";
import {
  CampResponse,
  CampSessionResponse,
  CreateUpdateCampRequest,
  CreateUpdateCampResponse,
  UpdateCampSessionsRequest,
} from "../types/CampsTypes";
import { isMinCampDetailsFilled } from "../utils/CampUtils";
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
  // Check if atleast the first step and 1 session is scheduled
  if (!isMinCampDetailsFilled(camp)) {
    throw new Error(
      `You must fill out all the required fields in step 1 and schedule at least 1 session before creating a camp`,
    );
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify(camp));

  const { data } = await baseAPIClient.post("/camp", formData, {
    headers: { Authorization: getBearerToken() },
  });
  return data;
};

const editCampById = async (
  id: string,
  camp: CreateUpdateCampRequest,
): Promise<CreateUpdateCampResponse> => {
  // Check if atleast the first step and 1 session is scheduled
  if (!isMinCampDetailsFilled(camp)) {
    throw new Error(
      `You must fill out all the required fields in step 1 and schedule at least 1 session before updating a camp`,
    );
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify({ ...camp }));
  const { data } = await baseAPIClient.patch(`/camp/${id}`, formData, {
    headers: {
      Authorization: getBearerToken(),
    },
  });

  return data;
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
