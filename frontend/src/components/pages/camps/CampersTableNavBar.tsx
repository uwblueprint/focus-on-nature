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

  const campCapacity = 20;
  const emptyTest: Camper[] = [];
  const campersTest: Camper[] = [
    {
      firstName: "Joe",
      lastName: "Bob",
      age: 12,
      allergies: "you",
      earlyDropoff: [new Date()],
      latePickup: [new Date()],
      specialNeeds: "",
      contacts: [
        {
          firstName: "Mommy",
          lastName: "Bob",
          email: "mommyyy@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Daddy",
          lastName: "Bob",
          email: "daddyyyy@gmail.com",
          phoneNumber: "123-456-7890",
        },
      ],
    },
    {
      firstName: "Thing",
      lastName: "Bob",
      age: 10,
      allergies: "you",
      earlyDropoff: [new Date()],
      latePickup: [new Date()],
      specialNeeds: "yes",
      contacts: [
        {
          firstName: "Mommy",
          lastName: "Yot",
          email: "mommyyy@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Daddy",
          lastName: "Stuff",
          email: "daddyyyy@gmail.com",
          phoneNumber: "123-456-7890",
        },
      ],
    },
    {
      firstName: "Bro",
      lastName: "Bob",
      age: 11,
      allergies: "you",
      earlyDropoff: [new Date()],
      latePickup: [new Date()],
      specialNeeds: "",
      contacts: [
        {
          firstName: "Mommy",
          lastName: "Yes",
          email: "mommyyy@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Daddy",
          lastName: "That",
          email: "daddyyyy@gmail.com",
          phoneNumber: "123-456-7890",
        },
      ],
    },
    {
      firstName: "Sup",
      lastName: "Bob",
      age: 9,
      allergies: "you",
      earlyDropoff: [new Date()],
      latePickup: [new Date()],
      specialNeeds: "",
      contacts: [
        {
          firstName: "Mommy",
          lastName: "Nice",
          email: "mommyyy@gmail.com",
          phoneNumber: "123-456-7890",
        },
        {
          firstName: "Daddy",
          lastName: "Yoyo",
          email: "daddyyyy@gmail.com",
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
            <CampersTable campers={campersTest} campCapacity={campCapacity} />
          </TabPanel>
          <TabPanel>hi2</TabPanel>
          <TabPanel>hi3</TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default CampersTableNavBar;
