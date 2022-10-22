import { Container } from "@chakra-ui/react";
import React from "react";
import SessionSidePanel from "./CampCreation/SessionSidePanel";

const CampsPage = (): React.ReactElement => {
  return (
    <Container maxWidth="100vw" minHeight="100vh">
      <h2>Camps List Page</h2>
      <SessionSidePanel />
    </Container>
  );
};

export default CampsPage;
