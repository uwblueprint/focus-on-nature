import React from "react";
import {
  Box,
  Button,
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
import {
  CreateFormQuestionRequest,
  FormQuestion,
} from "../../../types/CampsTypes";
import Footer from "./Footer/Footer";
import RegistrationFormTemplateTab from "./FormTemplateTab";
import WaiverTab from "./WaiverTab";
import { CreateCamperRequest } from "../../../types/CamperTypes";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";

const campers: CreateCamperRequest[] = [
  {
    campSession: "63139cdec3d7b55b44a01541",
    firstName: "test",
    lastName: "test",
    age: 12,
    allergies: "",
    earlyDropoff: [new Date("2022-04-06T00:00:00.000+00:00")],
    latePickup: [new Date("2022-04-06T00:00:00.000+00:00")],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mommy",
        lastName: "?",
        email: "mommyyy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "mommy",
      },
      {
        firstName: "Daddy",
        lastName: "?",
        email: "daddy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "daddy",
      },
    ],
    registrationDate: new Date("2022-04-06T00:00:00.000+00:00"),
    hasPaid: false,
    // formResponses: "622cfedaaf70bf090031d064","five",
    chargeId: "hi",
    charges: {
      camp: 20,
      earlyDropoff: 0,
      latePickup: 0,
    },
    optionalClauses: [
      {
        clause: "",
        agreed: true,
      },
    ],
  },
  {
    campSession: "63139cdec3d7b55b44a01541",
    firstName: "test2",
    lastName: "test2",
    age: 12,
    allergies: "",
    // earlyDropoff: [new Date("2022-04-06T00:00:00.000+00:00")],
    earlyDropoff: [],
    latePickup: [new Date("2022-04-06T00:00:00.000+00:00")],
    // latePickup: [],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mommy",
        lastName: "?",
        email: "mommyyy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "mommy",
      },
      {
        firstName: "Daddy",
        lastName: "?",
        email: "daddy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "daddy",
      },
    ],
    registrationDate: new Date("2022-04-06T00:00:00.000+00:00"),
    hasPaid: false,
    // formResponses: "622cfedaaf70bf090031d064","five",
    chargeId: "hi",
    charges: {
      camp: 20,
      earlyDropoff: 0,
      latePickup: 0,
    },
    optionalClauses: [
      {
        clause: "",
        agreed: true,
      },
    ],
  },
];

function thing(): void {
  CamperAPIClient.registerCampers(campers);
}

const ProductDisplay = () => (
  <Container>
    <Button onClick={thing}>
      <Text>click here</Text>
    </Button>
  </Container>
);

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
    formQuestion: CreateFormQuestionRequest,
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

  const removeFormQuestionFromTemplate = async (formQuestion: FormQuestion) => {
    const res = await AdminAPIClient.removeFormQuestionFromTemplate(
      formQuestion.id,
    );

    if (res) {
      setFormTemplateQuestions((oldArr: FormQuestion[]) =>
        oldArr.filter((question: FormQuestion) => question !== formQuestion),
      );
      toast({
        description: "Question has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: false,
        variant: "subtle",
      });
    } else {
      toast({
        description: `An error occurred with deleting this question. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  const editFormQuestion = async (
    oldQuestion: FormQuestion,
    newQuestion: CreateFormQuestionRequest,
  ) => {
    const res = await AdminAPIClient.editFormQuestion(
      oldQuestion.id,
      newQuestion,
    );

    if (!(res instanceof Error)) {
      setFormTemplateQuestions((oldArr: FormQuestion[]) => {
        const newArr = [...oldArr];
        for (let i = 0; i < newArr.length; i += 1) {
          if (newArr[i] === oldQuestion) {
            newArr[i] = res;
            break;
          }
        }
        return newArr;
      });
      toast({
        description: "Question has been successfully edited.",
        status: "success",
        duration: 3000,
        isClosable: false,
        variant: "subtle",
      });
    } else {
      toast({
        description: `An error occurred with editing this question. Please try again.`,
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
                  onRemoveFormQuestion={removeFormQuestionFromTemplate}
                  onEditFormQuestion={editFormQuestion}
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
      <ProductDisplay />
      <Footer
        isWaiverFooter={selectedTab === TabOption.waiver}
        onAddWaiverSectionClick={onAddWaiverSectionClick}
        onAddFormQuestionToTemplateClick={onAddFormQuestionToTemplate}
      />
    </>
  );
};

export default GlobalFormsPage;
