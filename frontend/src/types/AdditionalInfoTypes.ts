export enum AdditionalInfoActions {
  UPDATE_RESPONSE,
}

export type AdditionalInfoReducerDispatch = UpdateResponse;

interface AdditionalInfoDispatchBase {
  type: AdditionalInfoActions;
}

interface AdditionalInfoDispatchWithData<T> extends AdditionalInfoDispatchBase {
  data: T;
}
export interface UpdateResponse
  extends AdditionalInfoDispatchWithData<string | number> {
  camperIndex: number; // The index of the the Camper object in the array its stored.
  question: string; // The question that the response is for.
}
