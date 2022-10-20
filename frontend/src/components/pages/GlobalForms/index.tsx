import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { UpdateWaiverRequest, WaiverClause } from "../../../types/AdminTypes";
import Footer from "./Footer";
import RegistrationFormTemplate from "./RegistrationFormTemplate";
import WaiverLiabilityPermissionForm from "./WaiverLiabilityPermissionForm";

const GlobalFormsPage = (): React.ReactElement => {
  enum TabOption {
    registration = "REGISTRATION",
    waiver = "WAIVER",
  }
  const [selectedTab, setSelectedTab] = React.useState<TabOption>(
    TabOption.registration,
  );

  const waiver: UpdateWaiverRequest = {
    clauses: [
      { text: "thing 1", required: true },
      { text: "thing 2", required: true },
      { text: "thing 3", required: true },
    ],
  };

  const toast = useToast();

  const onAddWaiverSectionClick = async (newClause: WaiverClause) => {
    waiver.clauses.push(newClause);
    const updatedWaiver: UpdateWaiverRequest = await AdminAPIClient.updateWaiver(
      waiver,
    );
    if (updatedWaiver.clauses) {
      const newSectionCharCode: number = updatedWaiver.clauses.length + 64;
      const newSectionChar: string = String.fromCharCode(newSectionCharCode);
      toast({
        description: `Section ${newSectionChar} has been added to the waiver form`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
    } else {
      toast({
        description: `Section could not be added, please try again later`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      background="background.grey.200"
      paddingTop="5px"
    >
      <Box marginTop="1rem" marginX="40px">
        <Text mb="1em" textStyle="displayXLarge">
          Form Management
        </Text>
        <Tabs variant="line" colorScheme="green">
          <TabList>
            <Tab
              fontWeight="bold"
              onClick={() => setSelectedTab(TabOption.registration)}
            >
              Registration Form Template
            </Tab>
            <Tab
              fontWeight="bold"
              onClick={() => setSelectedTab(TabOption.waiver)}
            >
              Waiver Liability and Permission Form
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RegistrationFormTemplate />
            </TabPanel>
            <TabPanel>
              <WaiverLiabilityPermissionForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Footer
        isWaiverFooter={selectedTab === TabOption.waiver}
        onAddWaiverSectionClick={onAddWaiverSectionClick}
      />
    </Container>
  );
};

export default GlobalFormsPage;
