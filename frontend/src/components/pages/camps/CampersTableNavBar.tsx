import {
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Td,
  Box,
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

export const CampersTableNavBar = () => {
  enum TabType {
    registration,
    waitlist,
  }

  const [tabIndex, setTabIndex] = React.useState(0);

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
        <TabPanels width="100%">
          <TabPanel padding="0">
            <Flex width="100%" justifyContent="right" alignItems="right">
              Search
            </Flex>

            <Box width="100%" whiteSpace="nowrap">
              Search
            </Box>

            <Table
              variant="simple"
              backgroundColor="white"
              outline="1px solid --chakra-colors-gray-900"
            >
              <Thead outline="1000">
                <Tr>
                  <Td>Camper Name/Age</Td>
                  <Td>Primary Emergency Contact</Td>
                  <Td>Secondary Emergency Contact</Td>
                  <Td>Camper Details</Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>hi</Td>
                  <Td>hi</Td>
                  <Td>hi</Td>
                  <Td>hi</Td>
                </Tr>
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>hi2</TabPanel>
          <TabPanel>hi3</TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default CampersTableNavBar;
