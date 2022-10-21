import { BEARER_TOKEN } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import {UpdateWaiverRequest,  Waiver } from "../types/AdminTypes";

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


const getWaiver = async () : Promise<Waiver>  => {
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
