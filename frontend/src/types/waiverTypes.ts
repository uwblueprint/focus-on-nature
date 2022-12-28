import { Waiver, WaiverClause } from "./AdminTypes";

export type WaiverReducerDispatch =
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
  CLICK_OPTIONAL_CLAUSE,
  ClICK_REQUIRED_CLAUSE,
  GET_CLAUSES,
  WRITE_NAME,
  WRITE_DATE,
}

export interface OptionalClauseResponse extends WaiverClause {
  agreed: boolean;
  optionSelected: boolean; // Whether the registrant has seleted either "I agree" or "I disagree" for the clause
}

/* eslint-disable-next-line */
export interface RequiredClauseResponse extends WaiverClause {}

export type WaiverInterface = {
  campName: string;
  waiver: Waiver;
  optionalClauses: OptionalClauseResponse[];
  requiredClauses: RequiredClauseResponse[];
  agreedRequiredClauses: boolean;
  loadingWaiver: boolean;
  name: string;
  date: string;
  waiverCompleted: boolean;
};
