import { BEARER_TOKEN } from "../constants/AuthConstants";
import {
  WaitlistedCamper,
  UpdateWaitlistedStatusType,
  EditCamperInfoFields,
  Camper
} from "../types/CamperTypes";
import baseAPIClient from "./BaseAPIClient";

const updateCampersById = async (
  id: Array<string>,
  camperData: EditCamperInfoFields
) : Promise<Array<Camper>> => {
  try{
    const body = {camperIds : id, ...camperData};
    console.log("body", body);
    const { data } = await baseAPIClient.patch(`/campers`, body, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error){
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

export default {
  getWaitlistedCamperById,
  updateCamperRegistrationStatus,
  deleteWaitlistedCamperById,
  updateCampersById
};
