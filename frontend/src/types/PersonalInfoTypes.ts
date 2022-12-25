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
export interface AddCamper extends PersonalInfoDispatchBase {
}

/* eslint-disable-next-line */
export interface DeleteCamper extends PersonalInfoDispatchBase {
  camperIndex: number; // The index of the the Camper object in the array its stored.
}

export interface UpdateCamper
  extends PersonalInfoDispatchWithData<string | number> {
  camperIndex: number; // The index of the the Camper object in the array its stored.
}

export interface UpdateContact
  extends PersonalInfoDispatchWithData<string | number> {
  contactIndex: number; // The index of the the Contact object in the array its stored.
}