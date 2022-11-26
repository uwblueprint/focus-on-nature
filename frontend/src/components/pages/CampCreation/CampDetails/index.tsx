import React from "react";
import { Box, Text } from "@chakra-ui/react";
import CampCreationForm from "./CampCreationForm";

const CampCreationDetails = (): JSX.Element => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Details</Text>
      <CampCreationForm/>
    </Box>
  );
};

export default CampCreationDetails;
