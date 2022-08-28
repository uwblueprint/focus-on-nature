import {
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import React from "react";
import CampersTable from "./CampersTable";
import WaitlistedCampersTable from "./WaitlistedCampersTable";

import {
  campSessionCapacity,
  campersTest,
  waitlistedCampersTest,
} from "./sampleData";

const CampersTableNavBar = (): JSX.Element => {
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <Container maxW="90vw" width="100%">
      <Tabs
        onChange={(index) => setTabIndex(index)}
        variant="line"
        colorScheme="green"
        outline="0"
        marginBottom="30px"
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
          <TabPanel padding="0">
            <WaitlistedCampersTable waitlistedCampers={waitlistedCampersTest} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default CampersTableNavBar;
