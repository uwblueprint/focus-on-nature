import { Box } from "@chakra-ui/react";
import React from "react";
import { WaiverClause } from "../../../types/WaiverTypes";
import Footer from "./Footer";
import WaiverPage from "./WaiverPage";

const GlobalFormsPage = (): React.ReactElement => {
  const dummyWaiverClauses: WaiverClause[] = [
    { text: "thing 1", required: true },
    { text: "thing 2", required: true },
    { text: "thing 3", required: true },
  ];

  const addClause = (newClause: WaiverClause) => {
    dummyWaiverClauses.push(newClause);
  };

  console.log(dummyWaiverClauses);

  return (
    <Box>
      <WaiverPage clauses={dummyWaiverClauses} />
      <Footer isWaiverFooter addClause={addClause} />
    </Box>
  );
};

export default GlobalFormsPage;
