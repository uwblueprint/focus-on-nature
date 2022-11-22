import { Waiver, WaiverClause } from "../../../../types/AdminTypes";

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
