import React from "react";
import {
  DeleteCamper,
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
  UpdateCamper,
  UpdateContact,
  UpdateResponse,
} from "../../../../../types/PersonalInfoTypes";
import { CampResponse } from "../../../../../types/CampsTypes";
import {
  EmergencyContact,
  RegistrantExperienceCamper,
} from "../../../../../types/CamperTypes";

export const CamperReducer = (
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >,
  action: PersonalInfoReducerDispatch,
): void => {
  setCampers((campers: RegistrantExperienceCamper[]) => {
    const newCampers: RegistrantExperienceCamper[] = JSON.parse(
      JSON.stringify(campers),
    ); // Deep Copy

    for (let i = 0; i < campers.length; i += 1) {
      newCampers[i].formResponses = campers[i].formResponses;
    } // Copy the formResponses map

    switch (action.type) {
      case PersonalInfoActions.ADD_CAMPER: {
        newCampers.push({
          firstName: "",
          lastName: "",
          age: NaN,
          refundStatus: "Paid",
          contacts: [],
          optionalClauses: [],
        });

        // Inject contact info
        newCampers[0].contacts.forEach((contact: EmergencyContact) => {
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
      case PersonalInfoActions.UPDATE_RESPONSE: {
        const { camperIndex, question, data } = action as UpdateResponse;
        const newResponses =
          newCampers[camperIndex].formResponses ?? new Map<string, string>();
        newResponses.set(question, data as string);
        newCampers[camperIndex].formResponses = newResponses;
        break;
      }
      case PersonalInfoActions.UPDATE_CONTACT_QUESTIONS_RESPONSE: {
        // question is the question stem of the emergency contact question
        // data is a string response
        const { question, data } = action as UpdateResponse;

        // Update all the campers with the new formResponses.
        // All campers will have the same emergency contact responses
        /* eslint-disable-next-line */
        for (const camper of newCampers) { 
          const newResponses =
            camper.formResponses ?? new Map<string, string>();
          newResponses.set(question, data as string);
          camper.formResponses = newResponses;
        }
        break;
      }
      default:
    }
    return newCampers;
  });
};

export const usePersonalInfoDispatcher = (
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >,
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
  const emailRegex = new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{2,3}");
  return emailRegex.test(email);
};

export const checkPhoneNumber = (phoneNumber: string): boolean => {
  return !!phoneNumber;
};

export const checkRelationToCamper = (relation: string): boolean => {
  return !!relation;
};

export const checkCamperCardComplete = (
  camp: CampResponse,
  camper: RegistrantExperienceCamper,
): boolean => {
  return (
    checkFirstName(camper.firstName) &&
    checkLastName(camper.lastName) &&
    checkAge(camper.age, camp.ageUpper, camp.ageLower)
  );
};

export const checkContactCardComplete = (
  camper: RegistrantExperienceCamper,
): boolean => {
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
  return true;
};

export const checkPersonalInfoFilled = (
  campers: RegistrantExperienceCamper[],
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

  // Check required personal info and contact info questions
  const step1RequiredQuestions = camp.formQuestions
    .filter(
      (question) =>
        question.category === "PersonalInfo" ||
        question.category === "EmergencyContact",
    )
    .filter((question) => question.required)
    .map((question) => question.question);

  if (
    !campers.every((camper) =>
      step1RequiredQuestions.every((question) =>
        camper.formResponses?.get(question),
      ),
    )
  ) {
    return false;
  }

  return true;
};
