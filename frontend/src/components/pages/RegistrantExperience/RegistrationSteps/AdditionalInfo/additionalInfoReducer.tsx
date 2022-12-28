import React from "react";
import {
  AdditionalInfoActions,
  AdditionalInfoReducerDispatch,
  UpdateResponse,
} from "../../../../../types/AdditionalInfoTypes";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { CampResponse } from "../../../../../types/CampsTypes";

// eslint-disable-next-line import/prefer-default-export
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
        const { camperIndex, question, field, data } = action as UpdateResponse;

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
