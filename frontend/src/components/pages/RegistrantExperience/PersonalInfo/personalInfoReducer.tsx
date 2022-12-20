import React from "react";
import {
  DeleteCamper,
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
  UpdateCamper,
  UpdateContact,
} from "../../../../types/PersonalInfoTypes";
import { Camper } from "../../../../types/CamperTypes";

export const camperReducer = (
  setCampers: React.Dispatch<React.SetStateAction<Camper[]>>,
  action: PersonalInfoReducerDispatch,
) => {
  setCampers((campers: Camper[]) => {
    const newCampers: Camper[] = JSON.parse(JSON.stringify(campers)); // Deep Copy
    switch (action.type) {
      case PersonalInfoActions.ADD_CAMPER: {
        newCampers.push({
          id: "",
          campSession: "",
          firstName: "",
          lastName: "",
          age: -1,
          contacts: [],
          registrationDate: new Date(),
          hasPaid: false,
          chargeId: "",
          charges: {
            camp: -1,
            earlyDropoff: -1,
            latePickup: -1,
          },
          optionalClauses: [],
        });

        // inject contact info
        /* eslint-disable-next-line */
        for (const contact of newCampers[0].contacts){
          newCampers[newCampers.length - 1].contacts.push(contact);
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
        for (const camper of campers) {
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
  setCampers: React.Dispatch<React.SetStateAction<Camper[]>>,
) => {
  const dispatch = (action: PersonalInfoReducerDispatch) => {
    camperReducer(setCampers, action);
  };
  return dispatch;
};

export const checkPersonalInfoFilled = (campers: Camper[]): boolean => {

  if (!(campers.length >= 1)) return false;
  /* eslint-disable-next-line */
  for (const camper of campers) {
    console.log("camper", camper)
    // Check camper card
    if (!(camper.firstName && camper.lastName && camper.age > -1))
      return false;

    // Check contact cards
    if (camper.contacts.length !== 2){
      console.log("no 1")
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
      ){
        console.log("no2", contact)
        return false;
      }
    }
  }
  console.log("yes")
  return true;
};
