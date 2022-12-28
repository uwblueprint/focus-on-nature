import { WaiverClause } from "../../../../../types/AdminTypes";
import {
  WaiverInterface,
  OptionalClauseResponse,
  WaiverReducerDispatch,
  WaiverActions,
  ClickOptionalClause,
  FillDate,
  FillName,
  RequiredClauseResponse,
} from "../../../../../types/waiverRegistrationTypes";

export const checkName = (name: string): boolean => {
  return !!name;
};

export const checkDate = (date: string): boolean => {
  return !!date;
};

export const checkRequiredClauses = (
  requiredClausesAgreed: boolean,
): boolean => {
  return requiredClausesAgreed;
};

export const checkOptionalClause = (
  optionalClauseResponse: OptionalClauseResponse,
): boolean => {
  return optionalClauseResponse.optionSelected !== false;
};

const waiverReducer = (
  waiverInterface: WaiverInterface,
  action: WaiverReducerDispatch,
): WaiverInterface => {
  const newWaiverInterface: WaiverInterface = { ...waiverInterface };
  switch (action.type) {
    case WaiverActions.GET_CLAUSES: {
      const optionalClauses: OptionalClauseResponse[] = [];
      const requiredClauses: RequiredClauseResponse[] = [];

      newWaiverInterface.waiver.clauses.forEach((clause: WaiverClause) => {
        if (clause.required) requiredClauses.push(clause);
        else
          optionalClauses.push({
            ...clause,
            agreed: false,
            optionSelected: false,
          }); // Note that we set agreed to false by default while in actuality, the clause is neither agreed to disagreed to by default
      });
      newWaiverInterface.optionalClauses = optionalClauses;
      newWaiverInterface.requiredClauses = requiredClauses;
      newWaiverInterface.agreedRequiredClauses = false;
      newWaiverInterface.loadingWaiver = false;
      break;
    }
    case WaiverActions.ClICK_REQUIRED_CLAUSE: {
      newWaiverInterface.agreedRequiredClauses = !newWaiverInterface.agreedRequiredClauses;
      break;
    }

    case WaiverActions.CLICK_OPTIONAL_CLAUSE: {
      if (!newWaiverInterface.optionalClauses) break;
      const { optionalClauseId, agreed } = action as ClickOptionalClause;

      const newOptionalClauses: OptionalClauseResponse[] = newWaiverInterface.optionalClauses?.map(
        (
          optionalClause: OptionalClauseResponse,
          index: number,
        ): OptionalClauseResponse => {
          if (index === optionalClauseId) {
            return { ...optionalClause, agreed, optionSelected: true };
          }
          return optionalClause;
        },
      );
      newWaiverInterface.optionalClauses = newOptionalClauses;
      break;
    }
    case WaiverActions.WRITE_NAME: {
      const { name } = action as FillName;
      newWaiverInterface.name = name;
      break;
    }
    case WaiverActions.WRITE_DATE: {
      const { date } = action as FillDate;
      newWaiverInterface.date = date;
      break;
    }
    default:
  }

  const optionalClausesAgreed = newWaiverInterface.optionalClauses.reduce(
    (accumulator, currentOptionalClause) =>
      accumulator && checkOptionalClause(currentOptionalClause),
    true,
  );

  newWaiverInterface.waiverCompleted =
    checkRequiredClauses(newWaiverInterface.agreedRequiredClauses) &&
    checkName(newWaiverInterface.name) &&
    checkDate(newWaiverInterface.date) &&
    optionalClausesAgreed;
  return newWaiverInterface;
};

export default waiverReducer;
