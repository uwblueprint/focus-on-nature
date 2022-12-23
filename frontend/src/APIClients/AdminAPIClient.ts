import { getBearerToken } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { FormTemplate, UpdateWaiverRequest, Waiver } from "../types/AdminTypes";
import { CreateFormQuestionRequest, FormQuestion } from "../types/CampsTypes";

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
  newFormQuestion: CreateFormQuestionRequest,
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

const removeFormQuestionFromTemplate = async (
  formQuestionId: string,
): Promise<boolean> => {
  try {
    await baseAPIClient.delete(
      `/admin/formTemplate/formQuestion/${formQuestionId}`,
      {
        headers: { Authorization: getBearerToken() },
      },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const editFormQuestion = async (
  oldQuestionId: string,
  question: CreateFormQuestionRequest,
): Promise<FormQuestion> => {
  try {
    const { data } = await baseAPIClient.patch(
      `/admin/formTemplate/formQuestion/${oldQuestionId}`,
      { newFormQuestion: question },
      {
        headers: { Authorization: getBearerToken() },
      },
    );
    return data;
  } catch (error) {
    return error as FormQuestion;
  }
};

export default {
  updateWaiver,
  getWaiver,
  addQuestionToTemplate,
  getFormTemplate,
  removeFormQuestionFromTemplate,
  editFormQuestion,
};
