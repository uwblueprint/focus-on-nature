export enum PersonalInfoActions {
  ADD_CAMPER,
  DELETE_CAMPER,
  UPDATE_CAMPER,
  UPDATE_CONTACT,
  UPDATE_RESPONSE,
  UPDATE_CONTACT_QUESTIONS_RESPONSE,
}

export type PersonalInfoReducerDispatch =
  | AddCamper
  | DeleteCamper
  | UpdateCamper
  | UpdateContact
  | UpdateResponse
  | UpdateCamper
  | UpdateContactQuestionsResponse;

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
  camperIndex: number; // The index of the the Camper object in the array its stored.
}

export interface UpdateCamper
  extends PersonalInfoDispatchWithData<string | number> {
  camperIndex: number; // The index of the the Camper object in the array its stored.
}

export interface UpdateResponse
  extends PersonalInfoDispatchWithData<string | number> {
  camperIndex: number; // The index of the the Camper object in the array its stored.
  question: string; // The question that the response is for.
}
export interface UpdateContactQuestionsResponse
  extends PersonalInfoDispatchWithData<string | number> {
  question: string; // The question that the response is for.
}

export interface UpdateContact
  extends PersonalInfoDispatchWithData<string | number> {
  contactIndex: number; // The index of the the Contact object in the array its stored.
}
