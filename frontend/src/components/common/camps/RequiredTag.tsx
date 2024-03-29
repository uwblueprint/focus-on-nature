import React from "react";
import { Box } from "@chakra-ui/react";

const RequiredTag = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="background.required.100"
      borderRadius="20px"
      padding="2px"
      marginLeft="40px"
      marginRight="40px"
      minW="100px"
      minH="10px"
      fontSize="15px"
      textAlign="center"
      color="text.critical.100"
      fontWeight="bold"
    >
      Required
    </Box>
  );
};

export default RequiredTag;
