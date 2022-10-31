import React from "react";

import { Text } from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";
import WaiverSectionCard from "./WaiverSectionCard";

interface WaiverTabProps {
  clauses: Array<WaiverClause>;
  onEditWaiverSection: (clauseText: string, clauseIsRequired: boolean, clauseIdx: number) => void;
  onDeleteWaiverSection: (idx: number) => void;
}

const WaiverTab = ({ clauses, onEditWaiverSection, onDeleteWaiverSection, }: WaiverTabProps): React.ReactElement => {

  return (
    <>
      {clauses && clauses.length > 0 ? (
        clauses.map((clause, idx) => {
          return (
            <WaiverSectionCard
              key={`waiver_section_card_${idx}`}
              clauseIdx={idx}
              clauseData={clause}
              onDeleteWaiverSection={onDeleteWaiverSection}
              onEditWaiverSection={onEditWaiverSection}
            />
          );
        })
      ) : (
        <Text marginX="2em" marginY="2em">
          There are no waiver clauses added yet. Click the add button below to
          add a clause!
        </Text>
      )}
    </>
  );
};

export default WaiverTab;
