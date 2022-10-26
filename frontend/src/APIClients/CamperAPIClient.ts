import { BEARER_TOKEN } from "../constants/AuthConstants";
import {
  WaitlistedCamper,
  UpdateWaitlistedStatusType,
  EditCamperInfoFields,
  Camper,
} from "../types/CamperTypes";
import baseAPIClient from "./BaseAPIClient";

const updateCampersById = async (
  id: Array<string>,
  camperData: EditCamperInfoFields,
): Promise<Array<Camper>> => {
  try {
    const body = { camperIds: id, ...camperData };

    // Can't send Map<string, string> over HTTP so need to convert to Object before
    if (camperData.formResponses) {
      body.formResponses = Object.assign(
        {},
        ...Array.from(camperData.formResponses.entries()).map(
          ([question, response]) => ({
            [question]: response,
          }),
        ),
      );
    }

    const { data } = await baseAPIClient.patch(`/campers`, body, {
      headers: { Authorization: BEARER_TOKEN },
    });

    return data;
  } catch (error) {
    return error as Array<Camper>;
  }
};

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

const deleteMultipleCampersById = async (ids: string[]): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/campers/`, {
      headers: { Authorization: BEARER_TOKEN },
      data: {
        camperIds: ids,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getCampersByChargeIdAndSessionId = async (
  chargeId: string,
  sessionId: string,
): Promise<Camper[]> => {
  try {
    const { data } = await baseAPIClient.get(
      `/campers/${chargeId}/${sessionId}`,
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
  updateCampersById,
  getCampersByChargeIdAndSessionId,
  deleteMultipleCampersById,
};
