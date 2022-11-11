import { BEARER_TOKEN } from "../constants/AuthConstants";
import {
  WaitlistedCamper,
  UpdateWaitlistedStatusType,
  Camper,
} from "../types/CamperTypes";
import baseAPIClient from "./BaseAPIClient";

const getWaitlistedCamperById = async (
  id: string,
): Promise<WaitlistedCamper> => {
  try {
    const { data } = await baseAPIClient.get(`/campers/waitlist/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as WaitlistedCamper;
  }
};

const updateCamperRegistrationStatus = async (
  id: string,
  updatedStatus: UpdateWaitlistedStatusType,
): Promise<WaitlistedCamper> => {
  try {
    const { data } = await baseAPIClient.patch(
      `/campers/waitlist/${id}`,
      updatedStatus,
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return data;
  } catch (error) {
    return error as WaitlistedCamper;
  }
};

const deleteWaitlistedCamperById = async (id: string): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/campers/waitlist/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getCampersByChargeId = async (chargeId: string): Promise<Camper[]> => {
  try {
    const { data } = await baseAPIClient.get(`/campers/?chargeId=${chargeId}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Camper[];
  }
};

const moveCampersToCampSession = async (
  camperIds: string[],
  campSessionId: string,
): Promise<Camper[]> => {
  try {
    const { data } = await baseAPIClient.patch(
      `/campers/campSession/${campSessionId}`,
      {
        camperIds,
      },
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return data;
  } catch (error) {
    return error as Camper[];
  }
};

export default {
  getWaitlistedCamperById,
  updateCamperRegistrationStatus,
  deleteWaitlistedCamperById,
  getCampersByChargeId,
  moveCampersToCampSession,
};
