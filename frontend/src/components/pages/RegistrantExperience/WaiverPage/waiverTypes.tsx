import { Waiver, WaiverClause } from "../../../../types/AdminTypes";

export enum WaiverActions {
  CLICKOPTIONALCLAUSE,
  ClICKREQUIREDCLAUSE,
  LOADEDWAIVER,
}

export interface OptionalClauseResponse extends WaiverClause {
  agreed: boolean;
}

/* eslint-disable-next-line */
export interface RequiredClauseResponse extends WaiverClause {}

export type WaiverInterface = {
  waiver: Waiver | undefined;
  optionalClauses: OptionalClauseResponse[];
  requiredClauses: RequiredClauseResponse[];
  agreedRequiredClauses: boolean;
  loadingWaiver: boolean;
};
