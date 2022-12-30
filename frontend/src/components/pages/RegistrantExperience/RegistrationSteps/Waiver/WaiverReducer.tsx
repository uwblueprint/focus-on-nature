import { Waiver } from "../../../../../types/AdminTypes";
import {
  WaiverInterface,
  OptionalClauseResponse,
  WaiverReducerDispatch,
  WaiverActions,
  ClickOptionalClause,
  FillDate,
  FillName,
  SetWaiverInterace,
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
  return optionalClauseResponse.agreed !== undefined;
};

const waiverReducer = (
  waiverInterface: WaiverInterface,
  action: WaiverReducerDispatch,
): WaiverInterface => {
  let newWaiverInterface: WaiverInterface = { ...waiverInterface };
  switch (action.type) {
    case WaiverActions.SET_WAIVER_INTERFACE: {
      const { waiver } = action as SetWaiverInterace;
      newWaiverInterface = waiver;
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
            return { ...optionalClause, agreed };
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
