import { Box } from "@chakra-ui/react";
import React from "react";
import SessionSidePanel from "./CampCreation/SessionSidePanel";
import CampsListPage from "./CampsList";

const CampsPage = (): React.ReactElement => {
  return (
    <Box>
      <CampsListPage />
      <SessionSidePanel />
    </Box>
  );
};

export default CampsPage;
