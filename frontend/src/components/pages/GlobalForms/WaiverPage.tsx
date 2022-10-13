import React from "react";

import { Text, Box } from "@chakra-ui/react";
import { WaiverClause } from "../../../types/AdminTypes";

const WaiverPage = ({
  clauses,
}: {
  clauses: WaiverClause[];
}): React.ReactElement => {
  const [waiverClauses, setWaiverClauses] = React.useState(clauses);

  React.useEffect(() => {
    setWaiverClauses(clauses);
  }, [clauses]);

  return (
    <Box p="5">
      <Text>hihi this is the waiver page</Text>
    </Box>
  );
};

export default WaiverPage;
