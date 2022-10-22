import { Box, Text } from "@chakra-ui/react";
import React from "react";
import AddSessionsForm from "./AddSessionsForm";

const SessionSidePanel = () => {
  return (
    <Box
      minWidth="35vw"
      minHeight="100vh"
      position="absolute"
      right="0"
      background="background.grey.200"
      alignSelf="flex-end"
    >
      <AddSessionsForm />
    </Box>
  );
};

export default SessionSidePanel;
