import { Box } from "@chakra-ui/react";
import React from "react";
import CampsListPage from "./CampsList";
import ScheduleSessionsPage from "./CampCreation/ScheduleSessions";

const CampsPage = (): React.ReactElement => {
  return (
    <Box>
      {/* <CampsListPage /> */}
      <ScheduleSessionsPage />
    </Box>
  );
};

export default CampsPage;
