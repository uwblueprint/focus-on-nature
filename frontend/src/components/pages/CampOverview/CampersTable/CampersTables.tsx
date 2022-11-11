import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";

import React from "react";
import textStyles from "../../../../theme/textStyles";
import { CampSession } from "../../../../types/CampsTypes";
import CampersTable from "./CampersTable";
import WaitlistedCampersTable from "./WaitlistedCampersTable";

type CampersTablesProps = {
  campSession: CampSession;
  updateCamp: () => void;
};

const CampersTables = ({
  campSession,
  updateCamp,
}: CampersTablesProps): JSX.Element => {
  return (
    <Box>
      <Tabs variant="line" colorScheme="green" outline="0" marginBottom="30px">
        <TabList>
          <Tab
            fontSize={textStyles.bodyRegular.fontSize}
            paddingX={0}
            marginRight="24px"
          >
            Registration List
          </Tab>
          <Tab fontSize={textStyles.bodyRegular.fontSize} paddingX={0}>
            Waitlist
          </Tab>
        </TabList>
        <TabPanels width="100%" marginTop="16px">
          <TabPanel padding="0">
            <CampersTable
              campers={campSession.campers}
              campSession={campSession}
              campSessionCapacity={campSession.capacity}
              updateCamp={updateCamp}
            />
          </TabPanel>
          <TabPanel padding="0">
            <WaitlistedCampersTable waitlistedCampers={campSession.waitlist} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CampersTables;
