import React, { useEffect } from "react";
import {
  Box,
  Accordion,
  Button,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FormQuestion,
  CreateFormQuestionRequest,
} from "../../../../types/CampsTypes";
import AddQuestionModal from "../../../common/formQuestions/AddQuestionModal";
import {
  EDLP_CAMPER_INFO_QUESTION,
  fixedCamperInfoQuestions,
  fixedEmergencyContactQuestions,
} from "../../../../constants/FixedQuestions";
import QuestionsAccordionItem from "../../../common/formQuestions/QuestionsAccordionItem";

type RegistrationFormPageProps = {
  formTemplateQuestions: Array<FormQuestion>;
  customQuestions: Array<CreateFormQuestionRequest>;
  onAddCustomQuestion: (newQuestion: CreateFormQuestionRequest) => void;
  onDeleteCustomQuestion: (
    questionToBeDeleted: CreateFormQuestionRequest,
  ) => void;
  onEditCustomQuestion: (
    oldQuestion: CreateFormQuestionRequest,
    newQuestion: CreateFormQuestionRequest,
  ) => void;
  setVisitedRegistrationPage: React.Dispatch<React.SetStateAction<boolean>>;
  campOffersEDLP: boolean;
};

const RegistrationFormPage = ({
  formTemplateQuestions,
  customQuestions,
  onAddCustomQuestion,
  onDeleteCustomQuestion,
  onEditCustomQuestion,
  setVisitedRegistrationPage,
  campOffersEDLP,
}: RegistrationFormPageProps): React.ReactElement => {
  useEffect(() => {
    setVisitedRegistrationPage(true);
  });

  const formTemplateCamperInfoQuestions = formTemplateQuestions.filter(
    (question) => question.category === "PersonalInfo",
  );
  const formTemplateEmergencyContactQuestions = formTemplateQuestions.filter(
    (question) => question.category === "EmergencyContact",
  );

  const customCamperInfoQuestions = customQuestions.filter(
    (question) => question.category === "PersonalInfo",
  );
  const customEmergencyContactQuestions = customQuestions.filter(
    (question) => question.category === "EmergencyContact",
  );
  const customCampSpecificQuestions = customQuestions.filter(
    (question) => question.category === "CampSpecific",
  );

  const {
    isOpen: isAddQuestionOpen,
    onOpen: onAddQuestionOpen,
    onClose: onAddQuestionClose,
  } = useDisclosure();

  const filteredFixedCamperInfoQuestions = campOffersEDLP
    ? fixedCamperInfoQuestions.concat([EDLP_CAMPER_INFO_QUESTION])
    : fixedCamperInfoQuestions;

  return (
    <Box mx="8vw" my="5vh">
      <AddQuestionModal
        isOpen={isAddQuestionOpen}
        onClose={onAddQuestionClose}
        onSave={onAddCustomQuestion}
      />
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={10}
      >
        <Text textStyle="displayXLarge">Registration Information</Text>
        <Button onClick={onAddQuestionOpen} variant="secondary">
          + Add Question
        </Button>
      </HStack>
      <Accordion allowToggle defaultIndex={0}>
        <QuestionsAccordionItem
          accordionTitle="Camper Information"
          fixedQuestions={[
            ...filteredFixedCamperInfoQuestions,
            ...formTemplateCamperInfoQuestions,
          ]}
          dynamicQuestions={customCamperInfoQuestions as FormQuestion[]}
          onDeleteCustomQuestion={onDeleteCustomQuestion}
          onEditCustomQuestion={onEditCustomQuestion}
          isTemplatePage={false}
        />
        <QuestionsAccordionItem
          accordionTitle="Emergency Contact Information"
          fixedQuestions={[
            ...fixedEmergencyContactQuestions,
            ...formTemplateEmergencyContactQuestions,
          ]}
          dynamicQuestions={customEmergencyContactQuestions as FormQuestion[]}
          onDeleteCustomQuestion={onDeleteCustomQuestion}
          onEditCustomQuestion={onEditCustomQuestion}
          isTemplatePage={false}
        />
        <QuestionsAccordionItem
          accordionTitle="Camp Specific Information"
          fixedQuestions={[]}
          dynamicQuestions={customCampSpecificQuestions as FormQuestion[]}
          onDeleteCustomQuestion={onDeleteCustomQuestion}
          onEditCustomQuestion={onEditCustomQuestion}
          isTemplatePage={false}
        />
      </Accordion>
    </Box>
  );
};

export default RegistrationFormPage;
