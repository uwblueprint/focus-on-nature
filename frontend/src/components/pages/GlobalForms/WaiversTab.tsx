import React from "react";
import { WaiverClause } from "../../../types/AdminTypes";
import WaiverSectionCard from "./WaiverSectionCard";

interface WaiversTabProps {
  clauses: Array<WaiverClause>;
}
const WaiversTab = ({ clauses }: WaiversTabProps): JSX.Element => {
  return (
    <>
      {clauses.map((clause, idx) => {
        return (
          <WaiverSectionCard
            key={`waiver_section_card_${idx}`}
            clauseIdx={idx}
            clauseData={clause}
          />
        );
      })}
    </>
  );
};

export default WaiversTab;
