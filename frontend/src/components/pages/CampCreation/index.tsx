import React, { useState, useEffect } from "react";
import { Box, VStack, useToast } from "@chakra-ui/react";
import CampDetails from "./CampDetails";
import ScheduleSessions from "./ScheduleSessions";
import RegistrationForm from "./RegistrationForm";
import CampCreationPages from "./CampCreationPages";
import CampCreationNavStepper from "./CampCreationNavStepper";
import CampCreationFooter from "./CampCreationFooter";
import { FormTemplate } from "../../../types/AdminTypes";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import {
  CreateFormQuestion,
  CreateCampSession,
} from "../../../types/CampsTypes";

const CampCreationPage = (): React.ReactElement => {
  // All response state from the three page components.
  const [campDetailsDummyOne, setCampDetailsDummyOne] = useState(false);
  const [campDetailsDummyTwo, setCampDetailsDummyTwo] = useState(false);
  const [campDetailsDummyThree, setCampDetailsDummyThree] = useState("");

  const [scheduledSessions, setScheduledSessions] = React.useState<
    CreateCampSession[]
  >([]);

  const [visitedRegistrationPage, setVisitedRegistrationPage] = useState(false);

  // Variables to determine whether or not all required fields have been filled out.
  // NOTE: This will depend on what type of state a page requires, i.e. determining
  // if a checkbox is checked is different than determining if an input field is filled.
  const isCampDetailsFilled =
    campDetailsDummyOne && campDetailsDummyTwo && campDetailsDummyThree !== "";
  const isScheduleSessionsFilled = scheduledSessions.length !== 0;
  const isRegistrationFormFilled = visitedRegistrationPage;

  const isCurrentStepCompleted = (step: CampCreationPages) => {
    switch (step) {
      case CampCreationPages.CampCreationDetailsPage:
        return isCampDetailsFilled;
      case CampCreationPages.ScheduleSessionsPage:
        return isScheduleSessionsFilled;
      case CampCreationPages.RegistrationFormPage:
        return isRegistrationFormFilled;
      default:
        return false;
    }
  };

  // State of what page to display.
  const [currentPage, setCurrentPage] = useState<CampCreationPages>(
    CampCreationPages.CampCreationDetailsPage,
  );

  // All state for registration form page.

  const [formTemplate, setFormTemplate] = useState<FormTemplate>();

  useEffect(() => {
    const getFormTemplate = async () => {
      const formTemplateFromDB = await AdminAPIClient.getFormTemplate();
      if (formTemplateFromDB) {
        setFormTemplate(formTemplateFromDB);
      }
    };
    getFormTemplate();
  }, []);

  const toast = useToast();

  const [customQuestions, setCustomQuestions] = useState<CreateFormQuestion[]>(
    [],
  );
  const onAddCustomQuestion = (newQuestion: CreateFormQuestion) => {
    setCustomQuestions((oldArr: CreateFormQuestion[]) => [
      ...oldArr,
      newQuestion,
    ]);
    toast({
      description: "Question has been successfully added.",
      status: "success",
      duration: 3000,
      isClosable: false,
      variant: "subtle",
    });
  };
  const onDeleteCustomQuestion = (questionToBeDeleted: CreateFormQuestion) => {
    setCustomQuestions((oldArr: CreateFormQuestion[]) =>
      oldArr.filter(
        (question: CreateFormQuestion) => question !== questionToBeDeleted,
      ),
    );
    toast({
      description: "Question has been successfully deleted.",
      status: "success",
      duration: 3000,
      isClosable: false,
      variant: "subtle",
    });
  };

  const onEditCustomQuestion = (
    oldQuestion: CreateFormQuestion,
    newQuestion: CreateFormQuestion,
  ) => {
    setCustomQuestions((oldArr: CreateFormQuestion[]) => {
      const newArr = [...oldArr];
      for (let i = 0; i < newArr.length; i += 1) {
        if (newArr[i] === oldQuestion) {
          newArr[i] = newQuestion;
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
  };

  const getCampCreationStepComponent = (page: CampCreationPages) => {
    switch (page) {
      case CampCreationPages.CampCreationDetailsPage:
        return (
          <CampDetails
            campDetailsDummyOne={campDetailsDummyOne}
            campDetailsDummyTwo={campDetailsDummyTwo}
            campDetailsDummyThree={campDetailsDummyThree}
            toggleCampDetailsDummyOne={() =>
              setCampDetailsDummyOne(!campDetailsDummyOne)
            }
            toggleCampDetailsDummyTwo={() =>
              setCampDetailsDummyTwo(!campDetailsDummyTwo)
            }
            handleCampDetailsDummyThree={(event) =>
              setCampDetailsDummyThree(event.target.value)
            }
          />
        );
      case CampCreationPages.ScheduleSessionsPage:
        return (
          <ScheduleSessions
            campTitle="Waterloo Photography Camp 2022 @7:00 AM - 3:00PM"
            scheduledSessions={scheduledSessions}
            setScheduledSessions={setScheduledSessions}
          />
        );
      case CampCreationPages.RegistrationFormPage:
        return (
          <RegistrationForm
            formTemplateQuestions={
              formTemplate ? formTemplate.formQuestions : []
            }
            customQuestions={customQuestions}
            onAddCustomQuestion={onAddCustomQuestion}
            onDeleteCustomQuestion={onDeleteCustomQuestion}
            onEditCustomQuestion={onEditCustomQuestion}
            setVisitedRegistrationPage={setVisitedRegistrationPage}
          />
        );
      default:
        throw new Error("unexpected camp creation page");
    }
  };

  const handleStepNavigation = (stepsToMove: number) => {
    const desiredStep = currentPage + stepsToMove;
    if (CampCreationPages[desiredStep]) {
      setCurrentPage(currentPage + stepsToMove);
    }
  };

  return (
    <VStack w="100vw" h="calc(100vh - 75px)">
      <CampCreationNavStepper
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isCampDetailsFilled={isCampDetailsFilled}
        isScheduleSessionsFilled={isScheduleSessionsFilled}
        isRegistrationFormFilled={isRegistrationFormFilled}
      />
      <Box w="100%" flex="1" mt={[0, "0 !important"]} pb={20}>
        {getCampCreationStepComponent(currentPage)}
      </Box>
      <CampCreationFooter
        currentStep={currentPage}
        isCurrentStepCompleted={isCurrentStepCompleted(currentPage)}
        handleStepNavigation={handleStepNavigation}
      />
    </VStack>
  );
};

export default CampCreationPage;
