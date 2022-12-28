import React from "react";
import {
  AdditionalInfoActions,
  AdditionalInfoReducerDispatch,
  UpdateResponse,
} from "../../../../../types/AdditionalInfoTypes";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../types/CampsTypes";

export const CamperReducer = (
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >,
  action: AdditionalInfoReducerDispatch,
): void => {
  setCampers((campers: RegistrantExperienceCamper[]) => {
    const newCampers: RegistrantExperienceCamper[] = [...campers];
    switch (action.type) {
      case AdditionalInfoActions.UPDATE_RESPONSE: {
        const { camperIndex, question, data } = action as UpdateResponse;
        const newResponses =
          newCampers[camperIndex].formResponses ?? new Map<string, string>();
        newResponses.set(question, data as string);
        newCampers[camperIndex].formResponses = newResponses;
        break;
      }
      default:
    }
    return newCampers;
  });
};

export const useAdditionalInfoDispatcher = (
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >,
): ((action: AdditionalInfoReducerDispatch) => void) => {
  const dispatch = (action: AdditionalInfoReducerDispatch) => {
    CamperReducer(setCampers, action);
  };
  return dispatch;
};

export const getRequiredQuestions = (
  formQuestions: FormQuestion[],
): string[] => {
  const requiredQuestions: string[] = [];
  formQuestions.forEach((question) => {
    if (question.required) {
      requiredQuestions.push(question.question);
    }
  });
  return requiredQuestions;
};

export const checkAdditionalQuestionsAnswered = (
  campers: RegistrantExperienceCamper[],
  formQuestions: FormQuestion[],
  requireEarlyDropOffLatePickup: boolean | null,
): boolean => {
  if (requireEarlyDropOffLatePickup === null) {
    return false;
  }
  const requiredQuestions = getRequiredQuestions(formQuestions);
  return campers.every((camper) =>
    requiredQuestions.every((question) => camper.formResponses?.get(question)),
  );
};
