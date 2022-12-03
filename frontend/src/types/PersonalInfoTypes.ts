export type CamperCard = {
    FirstName: string,
    LastName: string,
    Age: number,
    Allergies: string,
    SpecialNeeds: string
}

export type PersonalInfoInterface = {
    campers: CamperCard[],
    contacts: Contact[] 
}

export type Contact = {
    FirstName: string,
    LastName: string,
    Age: number,
    Email: string,
    PhoneNumber: number,
}

export enum PersonalInfoActions {
    ADD_CAMPER,
    DELETE_CAMPER,
    UPDATE_CONTACT,
    UPDATE_CAMPER_FIRST_NAME,
    UPDATE_CAMPER_LAST_NAME,
    UPDATE_CAMPER_AGE,
    UPDATE_CAMPER_ALLERGIES,
    UPDATE_CAMPER_SPECIAL_NEEDS,
    UPDATE_CONTACT_FIRST_NAME,
    UPDATE_CONTACT_LAST_NAME,
    UPDATE_CONTACT_EMAIL,
    UPDATE_CONTACT_PHONE,
    UPDATE_CONTACT_RELATION,
  }

export type PersonalInfoReducerDispatch =
  | AddCamper
  | DeleteCamper
  | UpdateCamperFirstName
  | UpdateCamperLastName
  | UpdateCamperAllergies
  | UpdateCamperSpecialNeeds
  | UpdateCamperAge
  | UpdateContactFirstName
  | UpdateContactLastName
  | UpdateContactEmail
  | UpdateContactPhone
  | UpdateContactRelation;

interface PersonalInfoDispatchBase {
  type: PersonalInfoActions;
}

interface PersonalInfoDispatchWithData<T> extends PersonalInfoDispatchBase {
  data: T
}

/* eslint-disable-next-line */
export interface AddCamper extends PersonalInfoDispatchBase {}

export interface DeleteCamper extends PersonalInfoDispatchBase {
  camperId: number; // Currently, the id is set to be index of the the CamperCard in the array its stored.
}

export interface UpdateCamperFirstName extends PersonalInfoDispatchWithData<string> {}
export interface UpdateCamperLastName extends PersonalInfoDispatchWithData<string> {}
export interface UpdateCamperAllergies extends PersonalInfoDispatchWithData<string> {}
export interface UpdateCamperSpecialNeeds extends PersonalInfoDispatchWithData<string> {}
export interface UpdateCamperAge extends PersonalInfoDispatchWithData<number> {}
export interface UpdateContactFirstName extends PersonalInfoDispatchWithData<string> {}
export interface UpdateContactLastName extends PersonalInfoDispatchWithData<string> {}
export interface UpdateContactEmail extends PersonalInfoDispatchWithData<string> {}
export interface UpdateContactPhone extends PersonalInfoDispatchWithData<number> {}
export interface UpdateContactRelation extends PersonalInfoDispatchWithData<string> {}
