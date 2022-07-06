import { validateArray, validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const validateFormQuestion = async (formQuestion: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) => {
  if (!validatePrimitive(formQuestion.type, "string")) {
    return false;
  }

  // NOTE: Jason
  // duplicated dependency with QuestionType
  if (!["Text", "MultipleChoice", "Multiselect"].includes(formQuestion.type)) {
    return false;
  }

  if (!validatePrimitive(formQuestion.question, "string")) {
    return false;
  }
  if (!validatePrimitive(formQuestion.required, "boolean")) {
    return false;
  }
  if (
    formQuestion.description &&
    !validatePrimitive(formQuestion.description, "string")
  ) {
    return false;
  }
  if (formQuestion.options && !validateArray(formQuestion.options, "string")) {
    return false;
  }
  return true;
};
