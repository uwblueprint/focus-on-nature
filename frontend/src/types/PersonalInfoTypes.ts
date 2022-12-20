export enum PersonalInfoActions {
  ADD_CAMPER,
  DELETE_CAMPER,
  UPDATE_CAMPER,
  UPDATE_CONTACT,
}

export type PersonalInfoReducerDispatch =
  | AddCamper
  | DeleteCamper
  | UpdateCamper
  | UpdateContact;

interface PersonalInfoDispatchBase {
  type: PersonalInfoActions;
}

interface PersonalInfoDispatchWithData<T> extends PersonalInfoDispatchBase {
  data: T;
  field: string;
}

/* eslint-disable-next-line */
export interface AddCamper extends PersonalInfoDispatchBase {}

/* eslint-disable-next-line */
export interface DeleteCamper extends PersonalInfoDispatchBase {
  camperId: number; // Currently, the id is set to be index of the the Camper object in the array its stored.
}

export interface UpdateCamper
  extends PersonalInfoDispatchWithData<string | number> {
  camperId: number; // Currently, the id is set to be index of the the Camper object in the array its stored.
}

export interface UpdateContact
  extends PersonalInfoDispatchWithData<string | number> {
  contactId: number; // Currently, the id is set to be index of the the Contact object in the array its stored.
}
