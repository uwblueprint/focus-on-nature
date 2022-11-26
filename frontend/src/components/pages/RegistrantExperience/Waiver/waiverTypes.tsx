import { Waiver, WaiverClause } from "../../../../types/AdminTypes";

export type WaiverReducerDispatch =
  | LoadedWaiver
  | ClickOptionalClause
  | ClickRequiredClauses;
export interface WaiverReducerDispatchBase {
  type: WaiverActions;
}

export interface LoadedWaiver extends WaiverReducerDispatchBase {
  type: WaiverActions;
  waiver: Waiver;
}
export interface ClickOptionalClause extends WaiverReducerDispatchBase {
  type: WaiverActions;
  optionalClauseId: number; // Currently, the id is set to be index of the the optional clause in the array its stored.
}

/* eslint-disable-next-line */
export interface ClickRequiredClauses extends WaiverReducerDispatchBase{}

export enum WaiverActions {
  CLICK_OPTIONAL_CLAUSE,
  ClICK_REQUIRED_CLAUSE,
  LOADED_WAIVER,
}

export interface OptionalClauseResponse extends WaiverClause {
  agreed: boolean;
}

/* eslint-disable-next-line */
export interface RequiredClauseResponse extends WaiverClause {}

export type WaiverInterface = {
  campName: string | undefined;
  waiver: Waiver | undefined;
  optionalClauses: OptionalClauseResponse[];
  requiredClauses: RequiredClauseResponse[];
  agreedRequiredClauses: boolean;
  loadingWaiver: boolean;
};
