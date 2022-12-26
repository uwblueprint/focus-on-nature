import React from "react";
import {
  DeleteCamper,
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
  UpdateCamper,
  UpdateContact,
} from "../../../../types/PersonalInfoTypes";
import { CreateCamperRequest } from "../../../../types/CamperTypes";
import { CampResponse } from "../../../../types/CampsTypes";

export const CamperReducer = (
  setCampers: React.Dispatch<React.SetStateAction<CreateCamperRequest[]>>,
  action: PersonalInfoReducerDispatch,
): void => {
  setCampers((campers: CreateCamperRequest[]) => {
    const newCampers: CreateCamperRequest[] = JSON.parse(
      JSON.stringify(campers),
    ); // Deep Copy
    switch (action.type) {
      case PersonalInfoActions.ADD_CAMPER: {
        newCampers.push({
          firstName: "",
          lastName: "",
          age: NaN,
          contacts: [],
          registrationDate: new Date(),
          hasPaid: false,
          chargeId: "",
          optionalClauses: [],
        });

        // inject contact info
        newCampers[0].contacts.forEach((contact) => {
          newCampers[newCampers.length - 1].contacts.push(
            JSON.parse(JSON.stringify(contact)),
          ); // Deep copy the contact
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
        else if (field === "allergies")
          newCampers[camperIndex][field] = data as string;
        else if (field === "specialNeeds")
          newCampers[camperIndex][field] = data as string;
        break;
      }
      case PersonalInfoActions.UPDATE_CONTACT: {
        const { contactIndex, field, data } = action as UpdateContact;
        /* eslint-disable-next-line */
        for (const camper of newCampers) {
          if (field === "firstName")
            camper.contacts[contactIndex][field] = data as string;
          else if (field === "lastName")
            camper.contacts[contactIndex][field] = data as string;
          else if (field === "email")
            camper.contacts[contactIndex][field] = data as string;
          else if (field === "phoneNumber")
            camper.contacts[contactIndex][field] = data as string;
          else if (field === "relationshipToCamper")
            camper.contacts[contactIndex][field] = data as string;
        }
        break;
      }
      default:
    }
    return newCampers;
  });
};

export const usePersonalInfoDispatcher = (
  setCampers: React.Dispatch<React.SetStateAction<CreateCamperRequest[]>>,
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

export const checkPersonalInfoFilled = (
  campers: CreateCamperRequest[],
  camp: CampResponse | undefined,
): boolean => {
  // Wait for the camp info as we need it to determine personalInfo age field validity
  if (!camp) return false;

  if (!(campers.length >= 1)) return false;

  /* eslint-disable-next-line */
  for (const camper of campers) {
    // Check camper card
    if (
      !(
        checkFirstName(camper.firstName) &&
        checkLastName(camper.lastName) &&
        checkAge(camper.age, camp.ageUpper, camp.ageLower)
      )
    )
      return false;

    // Check contact cards
    if (camper.contacts.length > 2 || camper.contacts.length < 1) {
      return false; // Need to have either 1 or 2 contacts only
    }

    // Check primary contact card
    const primaryContact = camper.contacts[0];
    if (
      !(
        checkFirstName(primaryContact.firstName) &&
        checkLastName(primaryContact.lastName) &&
        checkEmail(primaryContact.email) &&
        checkPhoneNumber(primaryContact.phoneNumber) &&
        checkRelationToCamper(primaryContact.relationshipToCamper)
      )
    ) {
      return false;
    }

    // Check secondary contact card
    if (camper.contacts.length > 1) {
      const secondaryContact = camper.contacts[1];
      if (
        (secondaryContact.firstName ||
          secondaryContact.lastName ||
          secondaryContact.email ||
          secondaryContact.phoneNumber ||
          secondaryContact.relationshipToCamper) &&
        !(
          checkFirstName(secondaryContact.firstName) &&
          checkLastName(secondaryContact.lastName) &&
          checkEmail(secondaryContact.email) &&
          checkPhoneNumber(secondaryContact.phoneNumber) &&
          checkRelationToCamper(secondaryContact.relationshipToCamper)
        )
      ) {
        return false;
      }
    }
  }
  return true;
};
