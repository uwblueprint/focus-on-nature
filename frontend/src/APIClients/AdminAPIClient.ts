import { BEARER_TOKEN } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { FormTemplate, UpdateWaiverRequest, Waiver } from "../types/AdminTypes";

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

const getWaiver = async (): Promise<Waiver> => {
  try {
    const { data } = await baseAPIClient.get(`/admin/waiver`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Waiver;
  }
};

const getFormTemplate = async () : Promise<FormTemplate> => {
  try{
    const {data} = await baseAPIClient.get(
      '/admin/formTemplate',
      { headers: { Authorization: BEARER_TOKEN }}
    );
    console.log(data);
    return data;
  } catch (error) {
    return error as FormTemplate;
  }
}

export default {
  updateWaiver,
  getWaiver,
  getFormTemplate,
};
