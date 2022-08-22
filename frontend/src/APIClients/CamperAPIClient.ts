import { BEARER_TOKEN } from "../constants/AuthConstants";
import { WaitlistedCamper } from "../types/CamperTypes";
import baseAPIClient from "./BaseAPIClient";


const updateCamperRegistrationStatus = async(id: string): Promise<WaitlistedCamper> => {
    try {
      const { data } = await baseAPIClient.get(`/campers/waitlist/${id}`, {
        headers: { Authorization: BEARER_TOKEN },
      });
      return data;
    } catch (error) {
        return error as WaitlistedCamper;
    }
  }



export default {
    updateCamperRegistrationStatus,
};
