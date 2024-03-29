import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";

import React from "react";
import textStyles from "../../../../theme/textStyles";
import { CampSession, FormQuestion } from "../../../../types/CampsTypes";
import CampersTable from "./CampersTable";
import WaitlistedCampersTable from "./WaitlistedCampersTable";

type CampersTablesProps = {
  campSession: CampSession;
  formQuestions: FormQuestion[];
  handleRefetch: () => void;
  generateCsv: () => void;
};

const CampersTables = ({
  campSession,
  formQuestions,
  handleRefetch,
  generateCsv,
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
              formQuestions={formQuestions}
              campSessionCapacity={campSession.capacity}
              handleRefetch={handleRefetch}
              generateCsv={generateCsv}
              sessionDates={campSession.dates}
            />
          </TabPanel>
          <TabPanel padding="0">
            <WaitlistedCampersTable
              waitlistedCampers={campSession.waitlist}
              handleRefetch={handleRefetch}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CampersTables;
