import { BEARER_TOKEN } from "../constants/AuthConstants";
import { UpdateWaiverRequest } from "../types/AdminTypes";
import baseAPIClient from "./BaseAPIClient";

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
};

export default {
  updateWaiver,
};
