export enum AdditionalInfoActions {
  ADD_CAMPER,
  DELETE_CAMPER,
  UPDATE_CAMPER,
  UPDATE_RESPONSE,
}

export type AdditionalInfoReducerDispatch =
  | AddCamper
  | DeleteCamper
  | UpdateCamper
  | UpdateResponse;

interface AdditionalInfoDispatchBase {
  type: AdditionalInfoActions;
}

interface AdditionalInfoDispatchWithData<T> extends AdditionalInfoDispatchBase {
  data: T;
  field: string;
}

/* eslint-disable-next-line */
export interface AddCamper extends AdditionalInfoDispatchBase {}

/* eslint-disable-next-line */
export interface DeleteCamper extends AdditionalInfoDispatchBase {
  camperIndex: number; // The index of the the Camper object in the array its stored.
}

export interface UpdateCamper
  extends AdditionalInfoDispatchWithData<string | number> {
  camperIndex: number; // The index of the the Camper object in the array its stored.
}

export interface UpdateContact
  extends AdditionalInfoDispatchWithData<string | number> {
  contactIndex: number; // The index of the the Contact object in the array its stored.
}

export interface UpdateResponse
  extends AdditionalInfoDispatchWithData<string | number> {
  camperIndex: number; // The index of the the Camper object in the array its stored.
  question: string; // The question that the response is for.
}
