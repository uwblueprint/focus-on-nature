import React from "react";
import {Text, Container} from '@chakra-ui/react'
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { ClauseInfo } from "../../../types/AdminTypes";
import WaiversTab from "./WaiversTab";

const GlobalFormsPage = (): React.ReactElement => {

  const [waiver, setWaiver] = React.useState([]as ClauseInfo[]);
  React.useEffect(() => {
    const getWaiver = async () => {
      const res = await AdminAPIClient.getWaiver();
      if (res.clauses.length !== undefined) setWaiver(res.clauses);
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
      <WaiversTab clauses={waiver}/>

    </Container>
  );
};

export default GlobalFormsPage;
