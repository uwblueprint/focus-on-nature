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
  switch (action.type) {
    case WaiverActions.LOADED_WAIVER: {
      const optionalClauses: OptionalClauseResponse[] = [];
      const requiredClauses: RequiredClauseResponse[] = [];
      const { waiver } = action as LoadedWaiver;

      waiver.clauses.forEach((clause: WaiverClause) => {
        if (clause.required) requiredClauses.push(clause);
        else optionalClauses.push({ ...clause, agreed: false });
      });
      return {
        ...waiverInterface,
        optionalClauses,
        requiredClauses,
        waiver,
        agreedRequiredClauses: false,
        loadingWaiver: false,
      };
    }
    case WaiverActions.ClICK_REQUIRED_CLAUSE:
      return {
        ...waiverInterface,
        agreedRequiredClauses: !waiverInterface.agreedRequiredClauses,
      };

    case WaiverActions.CLICK_OPTIONAL_CLAUSE: {
      if (!waiverInterface.optionalClauses) return waiverInterface;
      const { optionalClauseId } = action as ClickOptionalClause;

      const newOptionalClauses: OptionalClauseResponse[] = waiverInterface.optionalClauses?.map(
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
      return {
        ...waiverInterface,
        optionalClauses: newOptionalClauses,
      };
    }
    case WaiverActions.WRITE_NAME: {
      const { name } = action as FillName;
      if (name) return { ...waiverInterface, wroteName: true };
      return { ...waiverInterface, wroteName: false };
    }
    case WaiverActions.WRITE_DATE: {
      const { date } = action as FillDate;
      if (date) return { ...waiverInterface, wroteDate: true };
      return { ...waiverInterface, wroteDate: false };
    }
    default:
      return waiverInterface;
  }
};

export default waiverReducer;
