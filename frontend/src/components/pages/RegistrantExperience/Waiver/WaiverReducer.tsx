import {
  WaiverInterface,
  OptionalClauseResponse,
  RequiredClauseResponse,
  WaiverReducerDispatch,
  WaiverActions,
  LoadedWaiver,
  ClickOptionalClause,
  FillDate,
  FillName,
} from "../../../../types/waiverTypes";
import { WaiverClause } from "../../../../types/AdminTypes";

const waiverReducer = (
  waiverInterface: WaiverInterface,
  action: WaiverReducerDispatch,
) => {
  const newWaiverInterface: WaiverInterface = { ...waiverInterface };
  switch (action.type) {
    case WaiverActions.LOADED_WAIVER: {
      const optionalClauses: OptionalClauseResponse[] = [];
      const requiredClauses: RequiredClauseResponse[] = [];
      const { waiver } = action as LoadedWaiver;

      waiver.clauses.forEach((clause: WaiverClause) => {
        if (clause.required) requiredClauses.push(clause);
        else optionalClauses.push({ ...clause, agreed: false });
      });
      newWaiverInterface.optionalClauses = optionalClauses;
      newWaiverInterface.requiredClauses = requiredClauses;
      newWaiverInterface.waiver = waiver;
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
      const { optionalClauseId } = action as ClickOptionalClause;

      const newOptionalClauses: OptionalClauseResponse[] = newWaiverInterface.optionalClauses?.map(
        (
          optionalClause: OptionalClauseResponse,
          index: number,
        ): OptionalClauseResponse => {
          if (index === optionalClauseId) {
            return { ...optionalClause, agreed: !optionalClause.agreed };
          }
          return optionalClause;
        },
      );
      newWaiverInterface.optionalClauses = newOptionalClauses;
      break;
    }
    case WaiverActions.WRITE_NAME: {
      const { name } = action as FillName;
      newWaiverInterface.wroteName = !!name;
      break;
    }
    case WaiverActions.WRITE_DATE: {
      const { date } = action as FillDate;
      newWaiverInterface.wroteDate = !!date;
      break;
    }
    default:
  }
  newWaiverInterface.waiverCompleted =
    newWaiverInterface.agreedRequiredClauses &&
    newWaiverInterface.wroteDate &&
    newWaiverInterface.wroteName;
  return newWaiverInterface;
};

export default waiverReducer;
