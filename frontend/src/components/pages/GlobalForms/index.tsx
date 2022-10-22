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
import {
  UpdateWaiverRequest,
  Waiver,
  WaiverClause,
} from "../../../types/AdminTypes";
import Footer from "./Footer/Footer";
import RegistrationFormTemplateTab from "./FormTemplateTab";
import WaiverTab from "./WaiverTab";

const GlobalFormsPage = (): React.ReactElement => {
  enum TabOption {
    registration = "REGISTRATION",
    waiver = "WAIVER",
  }

  const [selectedTab, setSelectedTab] = React.useState<TabOption>(
    TabOption.registration,
  );

  const [waiverClauses, setWaiverClauses] = React.useState(
    [] as WaiverClause[],
  );

  React.useEffect(() => {
    const getWaiver = async (): Promise<Waiver> => {
      const waiverResponse = await AdminAPIClient.getWaiver();
      if (waiverResponse) setWaiverClauses(waiverResponse.clauses);
      return waiverResponse;
    };

    getWaiver();
  }, []);

  const toast = useToast();

  const onAddWaiverSectionClick = async (newClause: WaiverClause) => {
    const curClauses = waiverClauses;
    curClauses.push(newClause);

    const updateWaiverRequest: UpdateWaiverRequest = { clauses: curClauses };

    const updatedWaiver: UpdateWaiverRequest = await AdminAPIClient.updateWaiver(
      updateWaiverRequest,
    );

    if (updatedWaiver.clauses) {
      setWaiverClauses(updatedWaiver.clauses);

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
    <>
      <Container
        maxWidth="100vw"
        minHeight="100vh"
        background="background.grey.200"
        paddingTop="3em"
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
                <RegistrationFormTemplateTab />
              </TabPanel>
              <TabPanel>
                <WaiverTab clauses={waiverClauses} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
      <Footer
        isWaiverFooter={selectedTab === TabOption.waiver}
        onAddWaiverSectionClick={onAddWaiverSectionClick}
      />
    </>
  );
};

export default GlobalFormsPage;
