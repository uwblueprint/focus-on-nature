import React from "react";

import {WaiverClause } from "../../../../types/AdminTypes";
import WaiverSectionCard from "./WaiverSectionCard";

interface WaiverTabProps {
  clauses: Array<WaiverClause>;
}

const WaiverTab = ({clauses}: WaiverTabProps): React.ReactElement => {
  
  return (
    <>
      {
        clauses.map((clause, idx) => {
          return (
            <WaiverSectionCard
              key={`waiver_section_card_${idx}`}
              clauseIdx={idx}
              clauseData={clause}
            />
          );
        })
      }
    </>
  );
};

export default WaiverTab;
