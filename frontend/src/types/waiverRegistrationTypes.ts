import { Waiver, WaiverClause } from "./AdminTypes";

export type WaiverReducerDispatch =
  | SetWaiverInterace
  | ClickOptionalClause
  | ClickRequiredClauses
  | FillName
  | FillDate;

/* eslint-disable-next-line */

export interface GetClauses extends WaiverReducerDispatchBase {
  type: WaiverActions;
}

export interface WaiverReducerDispatchBase {
  type: WaiverActions;
}

export interface SetWaiverInterace extends WaiverReducerDispatchBase {
  type: WaiverActions;
  waiver: WaiverInterface;
}

export interface ClickOptionalClause extends WaiverReducerDispatchBase {
  type: WaiverActions;
  agreed: boolean;
  optionalClauseId: number; // Currently, the id is set to be index of the the optional clause in the array its stored.
}

export interface FillName extends WaiverReducerDispatchBase {
  type: WaiverActions;
  name: string;
}
export interface FillDate extends WaiverReducerDispatchBase {
  type: WaiverActions;
  date: string;
}

/* eslint-disable-next-line */
export interface ClickRequiredClauses extends WaiverReducerDispatchBase {}

export enum WaiverActions {
  SET_WAIVER_INTERFACE,
  CLICK_OPTIONAL_CLAUSE,
  ClICK_REQUIRED_CLAUSE,
  WRITE_NAME,
  WRITE_DATE,
}

export interface OptionalClauseResponse extends WaiverClause {
  agreed: boolean | undefined;
}

/* eslint-disable-next-line */
export interface RequiredClauseResponse extends WaiverClause {}

export type WaiverInterface = {
  campName: string;
  waiver: Waiver;
  optionalClauses: OptionalClauseResponse[];
  requiredClauses: RequiredClauseResponse[];
  agreedRequiredClauses: boolean;
  name: string;
  date: string;
  waiverCompleted: boolean;
};
