import { BEARER_TOKEN } from "../constants/AuthConstants";
import { UpdateWaiverRequest } from "../types/AdminTypes";
import baseAPIClient from "./BaseAPIClient";

const updateWaiver = async (
  req: UpdateWaiverRequest,
): Promise<UpdateWaiverRequest> => {
  try {
    const { data } = await baseAPIClient.post(`/admin/waiver`, req, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as UpdateWaiverRequest;
  }
};

export default {
  updateWaiver,
};
