import React from "react";
import {
  AddCamper,
  DeleteCamper,
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
  UpdateCamper,
  UpdateContact,
} from "../../../../types/PersonalInfoTypes";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";

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
    switch (action.type) {
      case PersonalInfoActions.ADD_CAMPER: {
        const { campSessions } = action as AddCamper;
        // Add a unique camper entry for all registered camp sessions
        /* eslint-disable-next-line */
        const campSessionIds = Array.from(campSessions.map((campSession) => campSession.id));
        newCampers.push({
          id: "",
          campSessions: campSessionIds,
          firstName: "",
          lastName: "",
          age: NaN,
          contacts: [],
          registrationDate: new Date(),
          hasPaid: false,
          chargeId: "",
          charges: {
            camp: NaN,
            earlyDropoff: NaN,
            latePickup: NaN,
          },
          optionalClauses: [],
        });

        // inject contact info
        /* eslint-disable-next-line */
            for (const contact of newCampers[0].contacts){
          newCampers[newCampers.length - 1].contacts.push(
            JSON.parse(JSON.stringify(contact)),
          ); // Deep copy the contact
        }
        break;
      }
      case PersonalInfoActions.DELETE_CAMPER: {
        const { camperId } = action as DeleteCamper;
        newCampers.splice(camperId, 1);
        break;
      }
      case PersonalInfoActions.UPDATE_CAMPER: {
        const { camperId, field, data } = action as UpdateCamper;
        if (field === "firstName") newCampers[camperId][field] = data as string;
        else if (field === "lastName")
          newCampers[camperId][field] = data as string;
        else if (field === "age") newCampers[camperId][field] = data as number;
        else if (field === "allergies")
          newCampers[camperId][field] = data as string;
        else if (field === "specialNeeds")
          newCampers[camperId][field] = data as string;
        break;
      }
      case PersonalInfoActions.UPDATE_CONTACT: {
        const { contactId, field, data } = action as UpdateContact;
        /* eslint-disable-next-line */
        for (const camper of newCampers) {
          if (field === "firstName")
            camper.contacts[contactId][field] = data as string;
          else if (field === "lastName")
            camper.contacts[contactId][field] = data as string;
          else if (field === "email")
            camper.contacts[contactId][field] = data as string;
          else if (field === "phoneNumber")
            camper.contacts[contactId][field] = data as string;
          else if (field === "relationshipToCamper")
            camper.contacts[contactId][field] = data as string;
        }
        break;
      }
      default:
    }
    return newCampers;
  });
};

export const usePersonalInfoHook = (
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >,
): ((action: PersonalInfoReducerDispatch) => void) => {
  const dispatch = (action: PersonalInfoReducerDispatch) => {
    CamperReducer(setCampers, action);
  };
  return dispatch;
};

export const checkPersonalInfoFilled = (
  campers: RegistrantExperienceCamper[],
): boolean => {
  if (!(campers.length >= 1)) return false;
  /* eslint-disable-next-line */
  for (const camper of campers) {
    // Check camper card
    console.log("age", camper.age > -1);
    if (
      !(
        camper.firstName &&
        camper.lastName &&
        camper.age >= 7 &&
        camper.age <= 10
      )
    )
      return false;

    // Check contact cards
    if (camper.contacts.length !== 2) {
      return false; // Need to have 2 contacts
    }
    /* eslint-disable-next-line */
    for (const contact of camper.contacts) {
      if (
        !(
          contact.firstName &&
          contact.lastName &&
          contact.email &&
          contact.phoneNumber &&
          contact.relationshipToCamper
        )
      ) {
        return false;
      }
    }
  }
  return true;
};
