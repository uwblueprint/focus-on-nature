import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { CampersTableNavBar } from "./camps/CampersTableNavBar";

const CampsPage = (): React.ReactElement => {
  return (
    <Box backgroundColor="grey.200">
      <h2>Camps Page</h2>
      <CampersTableNavBar />
    </Box>
  );
};

export default CampsPage;
