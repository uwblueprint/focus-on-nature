import { getBearerToken } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { FormTemplate, UpdateWaiverRequest, Waiver } from "../types/AdminTypes";
import { CreateFormQuestion, FormQuestion } from "../types/CampsTypes";

const updateWaiver = async (
  updateWaiverData: UpdateWaiverRequest,
): Promise<UpdateWaiverRequest> => {
  try {
    const { data } = await baseAPIClient.post(
      `/admin/waiver`,
      updateWaiverData,
      {
        headers: { Authorization: getBearerToken() },
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
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error) {
    return error as Waiver;
  }
};

const addQuestionToTemplate = async (
  newFormQuestion: CreateFormQuestion,
): Promise<FormQuestion> => {
  try {
    const { data } = await baseAPIClient.patch(
      `/admin/formTemplate/formQuestion`,
      { formQuestion: newFormQuestion },
      {
        headers: { Authorization: getBearerToken() },
      },
    );
    return data;
  } catch (error) {
    return error as FormQuestion;
  }
};

const getFormTemplate = async (): Promise<FormTemplate> => {
  try {
    const { data } = await baseAPIClient.get("/admin/formTemplate", {
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error) {
    return error as FormTemplate;
  }
};

export default {
  updateWaiver,
  getWaiver,
  addQuestionToTemplate,
  getFormTemplate,
};
