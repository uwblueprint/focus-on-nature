import React from "react";
import { Text, Container } from "@chakra-ui/react";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { WaiverClause, WaiverResponse } from "../../../types/AdminTypes";
import WaiversTab from "./WaiversTab";

const GlobalFormsPage = (): React.ReactElement => {
  const [waiverClauses, setWaiverClauses] = React.useState(
    [] as WaiverClause[],
  );
  React.useEffect(() => {
    const getWaiver = async (): Promise<WaiverResponse> => {
      const waiverResponse = await AdminAPIClient.getWaiver();
      if (waiverResponse) setWaiverClauses(waiverResponse.clauses);
      return waiverResponse;
    };

    getWaiver();
  }, []);

  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      px="3em"
      py="3em"
      background="background.grey.200"
    >
      <Text textStyle="displayXLarge">Form Management</Text>
      <WaiversTab clauses={waiverClauses} />
    </Container>
  );
};

export default GlobalFormsPage;
