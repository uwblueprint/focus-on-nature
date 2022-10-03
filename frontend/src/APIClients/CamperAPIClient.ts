import { BEARER_TOKEN } from "../constants/AuthConstants";
import {
  Camper,
  WaitlistedCamper,
  UpdateWaitlistedStatusType,
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

const registerCampers = async (campers: Camper[]): Promise<void> => {
  try {
    await baseAPIClient.post(`/campers/register`, campers, {
      withCredentials: false,
      headers: { Autorization: BEARER_TOKEN },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getWaitlistedCamperById,
  updateCamperRegistrationStatus,
  deleteWaitlistedCamperById,
  registerCampers,
};
