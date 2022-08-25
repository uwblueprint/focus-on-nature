import {
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import React from "react";
import { Camper } from "../../../types/CamperTypes";
import CampersTable from "./CampersTable";

const CampersTableNavBar = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  // TODO - this is dependant on the selected camp session
  const campSessionCapacity = 4;
  // -----------------------------------------------------

  const emptyTest: Camper[] = [];
  const campersTest: Camper[] = [
    {
      firstName: "Joe",
      lastName: "Bob",
      age: 12,
      allergies: "peanuts",
      earlyDropoff: [new Date()],
      latePickup: [new Date()],
      specialNeeds: "",
      contacts: [
        {
          firstName: "Mom",
          lastName: "Bob",
          email: "momBob@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Dad",
          lastName: "Bob",
          email: "dadBob@gmail.com",
          phoneNumber: "123-456-7890",
        },
      ],
    },
    {
      firstName: "Fred",
      lastName: "McAlister",
      age: 10,
      allergies: "",
      latePickup: [new Date()],
      specialNeeds: "N/A",
      contacts: [
        {
          firstName: "Mom",
          lastName: "Fred",
          email: "momFred@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Dad",
          lastName: "Fred",
          email: "dadFred@gmail.com",
          phoneNumber: "123-456-7890",
        },
      ],
    },
    {
      firstName: "Josh",
      lastName: "Tod",
      age: 11,
      allergies: "",
      earlyDropoff: [new Date()],
      specialNeeds: "",
      contacts: [
        {
          firstName: "Mom",
          lastName: "Tod",
          email: "momTod@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Dad",
          lastName: "Toc",
          email: "dadTod@gmail.com",
          phoneNumber: "123-456-7890",
        },
      ],
    },
    {
      firstName: "Felicia",
      lastName: "Rose",
      age: 9,
      allergies: "pollen",
      earlyDropoff: [new Date()],
      latePickup: [new Date()],
      specialNeeds: "",
      contacts: [
        {
          firstName: "Mom",
          lastName: "Rose",
          email: "momRose@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Dad",
          lastName: "Rose",
          email: "dadRose@gmail.com",
          phoneNumber: "123-456-7890",
        },
      ],
    },
  ];

  return (
    <Container maxW="90vw" width="100%">
      <Tabs
        onChange={(index) => setTabIndex(index)}
        variant="line"
        colorScheme="green"
        outline="0"
      >
        <TabList>
          <Tab whiteSpace="nowrap">Registration List</Tab>
          <Tab>Waitlist</Tab>
        </TabList>
        <TabPanels width="100%" marginTop="16px">
          <TabPanel padding="0">
            <CampersTable
              campers={campersTest}
              campSessionCapacity={campSessionCapacity}
            />
          </TabPanel>
          <TabPanel>waitlist table here</TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default CampersTableNavBar;
