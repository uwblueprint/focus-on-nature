import React from "react";
import { CreateWaitlistedCamperDTO } from "../../../../types/CamperTypes";
import { CampResponse } from "../../../../types/CampsTypes";
import {
  DeleteCamper,
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
  UpdateCamper,
  UpdateContact,
} from "../../../../types/PersonalInfoTypes";

export const CamperReducer = (
  setCampers: React.Dispatch<React.SetStateAction<CreateWaitlistedCamperDTO[]>>,
  action: PersonalInfoReducerDispatch,
): void => {
  setCampers((campers: CreateWaitlistedCamperDTO[]) => {
    const newCampers: CreateWaitlistedCamperDTO[] = JSON.parse(
      JSON.stringify(campers),
    ); // Deep Copy

    switch (action.type) {
      case PersonalInfoActions.ADD_CAMPER: {
        newCampers.push({
          firstName: "",
          lastName: "",
          age: NaN,
          contactEmail: newCampers[0].contactEmail,
          contactFirstName: newCampers[0].contactFirstName,
          contactLastName: newCampers[0].contactLastName,
          contactNumber: newCampers[0].contactNumber,
        });
        break;
      }
      case PersonalInfoActions.DELETE_CAMPER: {
        const { camperIndex } = action as DeleteCamper;
        newCampers.splice(camperIndex, 1);
        break;
      }
      case PersonalInfoActions.UPDATE_CAMPER: {
        const { camperIndex, field, data } = action as UpdateCamper;
        if (field === "firstName")
          newCampers[camperIndex][field] = data as string;
        else if (field === "lastName")
          newCampers[camperIndex][field] = data as string;
        else if (field === "age")
          newCampers[camperIndex][field] = data as number;
        break;
      }
      case PersonalInfoActions.UPDATE_CONTACT: {
        const { field, data } = action as UpdateContact;
        /* eslint-disable-next-line */
        for (const camper of newCampers) {
          if (field === "contactFirstName") camper[field] = data as string;
          else if (field === "contactLastName") camper[field] = data as string;
          else if (field === "contactEmail") camper[field] = data as string;
          else if (field === "contactNumber") camper[field] = data as string;
        }
        break;
      }
      default:
    }
    return newCampers;
  });
};

export const usePersonalInfoDispatcher = (
  setCampers: React.Dispatch<React.SetStateAction<CreateWaitlistedCamperDTO[]>>,
): ((action: PersonalInfoReducerDispatch) => void) => {
  const dispatch = (action: PersonalInfoReducerDispatch) => {
    CamperReducer(setCampers, action);
  };
  return dispatch;
};

export const checkFirstName = (firstName: string): boolean => {
  return !!firstName;
};

export const checkLastName = (lastName: string): boolean => {
  return !!lastName;
};

export const checkAge = (
  age: number,
  campUpper: number,
  campLower: number,
): boolean => {
  return !!age && age >= campLower && age <= campUpper;
};

export const checkEmail = (email: string): boolean => {
  return !!email;
};

export const checkPhoneNumber = (phoneNumber: string): boolean => {
  return !!phoneNumber;
};

export const checkRelationToCamper = (relation: string): boolean => {
  return !!relation;
};

export const checkCamperCardComplete = (
  camp: CampResponse,
  camper: CreateWaitlistedCamperDTO,
): boolean => {
  return (
    checkFirstName(camper.firstName) &&
    checkLastName(camper.lastName) &&
    checkAge(camper.age, camp.ageUpper, camp.ageLower)
  );
};

export const checkContactCardComplete = (
  camper: CreateWaitlistedCamperDTO,
): boolean => {
  // Check primary contact card
  if (
    !(
      checkFirstName(camper.contactFirstName) &&
      checkLastName(camper.contactFirstName) &&
      checkEmail(camper.contactEmail) &&
      checkPhoneNumber(camper.contactNumber)
    )
  ) {
    return false;
  }
  return true;
};

export const checkPersonalInfoFilled = (
  campers: CreateWaitlistedCamperDTO[],
  camp: CampResponse | undefined,
): boolean => {
  // Wait for the camp info as we need it to determine personalInfo age field validity
  if (!camp) return false;

  if (!(campers.length >= 1)) return false;

  /* eslint-disable-next-line */
  for (const camper of campers) {
    if (
      !(
        checkCamperCardComplete(camp, camper) &&
        checkContactCardComplete(camper)
      )
    ) {
      return false;
    }
  }
  return true;
};
