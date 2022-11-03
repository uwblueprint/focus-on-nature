import { Box } from "@chakra-ui/react";
import React from "react";
import AddSessionsForm from "./AddSessionsForm";

const SessionSidePanel = (): JSX.Element => {
  return (
    <Box
      minWidth="35vw"
      minHeight="100vh"
      position="absolute"
      right="0"
      background="background.grey.200"
    >
      <AddSessionsForm />
    </Box>
  );
};

export default SessionSidePanel;