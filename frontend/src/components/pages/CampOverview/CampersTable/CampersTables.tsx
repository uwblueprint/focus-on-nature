import {
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import React from "react";
import { CampSession } from "../../../../types/CampsTypes";
import CampersTable from "./CampersTable";
import WaitlistedCampersTable from "./WaitlistedCampersTable";

type CampersTablesProps = {
  campSession: CampSession;
};

const CampersTables = ({ campSession }: CampersTablesProps): JSX.Element => {
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
              campers={campSession.campers}
              campSessionCapacity={campSession.capacity}
            />
          </TabPanel>
          <TabPanel padding="0">
            <WaitlistedCampersTable waitlistedCampers={campSession.waitlist} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default CampersTables;
