import React from "react";
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
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import {
  UpdateWaiverRequest,
  Waiver,
  WaiverClause,
} from "../../../types/AdminTypes";
import { CreateFormQuestion, FormQuestion } from "../../../types/CampsTypes";
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

  const [formTemplateQuestions, setFormTemplateQuestions] = React.useState<
    Array<FormQuestion>
  >([]);
  const [refetchFormTemplate, setRefetchFormTemplate] = React.useState<boolean>(
    true,
  );
  const handleRefetchFormTemplate = () => {
    setRefetchFormTemplate(!refetchFormTemplate);
  };

  // Initial function calls to get the waiver and form template questions
  React.useEffect(() => {
    const getWaiver = async (): Promise<Waiver> => {
      const waiverResponse = await AdminAPIClient.getWaiver();
      if (waiverResponse) setWaiverClauses(waiverResponse.clauses);
      return waiverResponse;
    };

    getWaiver();
  }, []);

  React.useEffect(() => {
    const getFormTemplate = async () => {
      const formTemplate = await AdminAPIClient.getFormTemplate();
      if (formTemplate) {
        setFormTemplateQuestions(formTemplate.formQuestions);
      }
    };

    getFormTemplate();
  }, [refetchFormTemplate]);

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

  const onEditWaiverSection = async (
    clauseData: WaiverClause,
    clauseIdx: number,
  ) => {
    const curClauses = waiverClauses;
    const clauseToEdit = curClauses[clauseIdx];
    clauseToEdit.text = clauseData.text;
    clauseToEdit.required = clauseData.required;

    const editWaiverRequest: UpdateWaiverRequest = { clauses: curClauses };

    const updatedWaiver: UpdateWaiverRequest = await AdminAPIClient.updateWaiver(
      editWaiverRequest,
    );

    if (updatedWaiver.clauses) {
      setWaiverClauses(updatedWaiver.clauses);

      const waiverCode: string = String.fromCharCode(clauseIdx + 65);

      toast({
        description: `Section ${waiverCode} has been updated`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
    } else {
      toast({
        description: `Section could not be updated`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  const onDeleteWaiverSection = async (idx: number) => {
    const curClauses = waiverClauses;
    curClauses.splice(idx, 1);

    const deleteWaiverRequest: UpdateWaiverRequest = { clauses: curClauses };

    const updatedWaiver: UpdateWaiverRequest = await AdminAPIClient.updateWaiver(
      deleteWaiverRequest,
    );

    if (updatedWaiver.clauses) {
      setWaiverClauses(updatedWaiver.clauses);

      const deletedWaiverCode: string = String.fromCharCode(idx + 65);

      toast({
        description: `Section ${deletedWaiverCode} has been deleted`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
    } else {
      toast({
        description: `Section could not be deleted`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  const onAddFormQuestionToTemplate = async (
    formQuestion: CreateFormQuestion,
  ) => {
    const newFormQuestion = await AdminAPIClient.addQuestionToTemplate(
      formQuestion,
    );

    if (newFormQuestion.id) {
      handleRefetchFormTemplate();

      toast({
        description: `Form question was added to the form template`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
    } else {
      toast({
        description: `Form question could not be added to the form template`,
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
        paddingY="3em"
      >
        <Box marginTop="1rem" marginX="100px">
          <Text mb="1em" textStyle="displayXLarge">
            Form Management
          </Text>
          <Tabs variant="line" colorScheme="green">
            <TabList marginBottom="20px">
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
                <RegistrationFormTemplateTab
                  templateQuestions={formTemplateQuestions}
                />
              </TabPanel>
              <TabPanel>
                <WaiverTab
                  clauses={waiverClauses}
                  onEditWaiverSection={onEditWaiverSection}
                  onDeleteWaiverSection={onDeleteWaiverSection}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
      <Footer
        isWaiverFooter={selectedTab === TabOption.waiver}
        onAddWaiverSectionClick={onAddWaiverSectionClick}
        onAddFormQuestionToTemplateClick={onAddFormQuestionToTemplate}
      />
    </>
  );
};

export default GlobalFormsPage;
