import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import CampsListPage from "./CampsList";

const CampsPage = (): React.ReactElement => {
  return (
    <Box>
      <CampsListPage />
    </Box>
  );
};

export default CampsPage;
