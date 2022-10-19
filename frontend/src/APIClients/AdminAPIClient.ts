import { BEARER_TOKEN } from "../constants/AuthConstants";
import { UpdateWaiverRequest } from "../types/AdminTypes";
import baseAPIClient from "./BaseAPIClient";
import { Waiver } from "../types/AdminTypes";

const updateWaiver = async (
  updateWaiverData: UpdateWaiverRequest,
): Promise<UpdateWaiverRequest> => {
  try {
    const { data } = await baseAPIClient.post(
      `/admin/waiver`,
      updateWaiverData,
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return data;
  } catch (error) {
    return error as UpdateWaiverRequest;
  }
}


const getWaiver = async () : Promise<WaiverResponse>  => {
  try {
    const { data } = await baseAPIClient.get(`/admin/waiver`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Waiver;
  }
};

export default {
  updateWaiver,
  getWaiver,
};
