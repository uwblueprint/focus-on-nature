import { AxiosError, AxiosResponse } from "axios";
import { getBearerToken } from "../constants/AuthConstants";
import {
  Camper,
  WaitlistedCamper,
  UpdateWaitlistedStatusType,
  EditCamperInfoFields,
  CreateWaitlistedCamperDTO,
  CreateCamperDTO,
  CreateCamperResponse,
  RefundDTO,
} from "../types/CamperTypes";
import baseAPIClient from "./BaseAPIClient";

const updateCampersById = async (
  id: Array<string>,
  camperData: EditCamperInfoFields,
): Promise<Array<Camper>> => {
  try {
    const body = { camperIds: id, ...camperData };

    // Can't send Map<string, string> over HTTP so need to convert to Object before
    if (camperData.formResponses instanceof Map) {
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
      headers: { Authorization: getBearerToken() },
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
      headers: { Authorization: getBearerToken() },
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
        headers: { Authorization: getBearerToken() },
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
      headers: { Authorization: getBearerToken() },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const deleteMultipleCampersById = async (ids: string[]): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/campers/`, {
      headers: { Authorization: getBearerToken() },
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
        headers: { Authorization: getBearerToken() },
      },
    );
    return data;
  } catch (error) {
    return error as Camper[];
  }
};

const registerCampers = async (
  campers: CreateCamperDTO[],
  campSessions: string[],
): Promise<CreateCamperResponse> => {
  const body = {
    campers,
    campSessions,
  };
  const { data } = await baseAPIClient.post(`/campers/register`, body, {
    headers: { Authorization: getBearerToken() },
  });

  return data;
};

const waitlistCampers = async (
  campers: CreateWaitlistedCamperDTO[],
  campSessions: string[],
): Promise<WaitlistedCamper[]> => {
  try {
    const body = { waitlistedCampers: campers, campSessions };
    const { data } = await baseAPIClient.post("/campers/waitlist", body, {
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error: AxiosError | unknown) {
    throw Error(((error as AxiosError).response as AxiosResponse).data.error);
  }
};

const getRefundInfo = async (refundCode: string): Promise<RefundDTO[]> => {
  try {
    const { data } = await baseAPIClient.get(`/campers/refund/${refundCode}`, {
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error) {
    return error as RefundDTO[];
  }
};

const sendSelectedRefundInfo = async (
  refundCode: string,
  selectedRefunds: Array<RefundDTO>,
): Promise<RefundDTO[]> => {
  try {
    const body = { selectedRefunds };
    const { data } = await baseAPIClient.put(`/campers/refund/${refundCode}`, body, {
      headers: { Authorization: getBearerToken() },
    });

    return data;
  } catch (error) {
    return error as RefundDTO[];
  }
};

const confirmPayment = async (chargeId: string): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      `/campers/confirm-payment/${chargeId}`,
      {
        headers: { Authorization: getBearerToken() },
      },
    );

    return data;
  } catch (error: unknown) {
    return false;
  }
};

export default {
  getWaitlistedCamperById,
  updateCamperRegistrationStatus,
  deleteWaitlistedCamperById,
  updateCampersById,
  getCampersByChargeIdAndSessionId,
  deleteMultipleCampersById,
  registerCampers,
  waitlistCampers,
  confirmPayment,
  getRefundInfo,
  sendSelectedRefundInfo,
};
