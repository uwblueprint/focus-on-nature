import {
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  TableCaption,
  Text,
  Thead,
  Tbody,
  Tr,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon } from "@chakra-ui/icons";

import React, { useState, useEffect } from "react";
import { Camper } from "../../../types/CamperTypes";
import { CampersTable } from "./CampersTable";

export const CampersTableNavBar = () =>
  // inputCampers: Camper[]
  {
    enum TabType {
      registration,
      waitlist,
    }

    const [tabIndex, setTabIndex] = React.useState(0);

    const b: Camper[] = [
      { firstName: "Jason", lastName: "Xiong", primaryContact: "bean" },
      { firstName: "Jason", lastName: "two", primaryContact: "bean" },
    ];

    return (
      <Container maxW="container.lg" width="100%">
        <Tabs
          onChange={(index) => setTabIndex(index)}
          variant="line"
          colorScheme="green"
          outline="0"
        >
          <TabList>
            <Tab whiteSpace="nowrap">Registration List</Tab>
            <Tab>Waitlist</Tab>
            <Tab>Hello</Tab>
          </TabList>
          <TabPanels width="100%" marginTop="16px">
            <TabPanel padding="0">
              <CampersTable campers={b} />
            </TabPanel>
            <TabPanel>hi2</TabPanel>
            <TabPanel>hi3</TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    );
  };

export default CampersTableNavBar;
