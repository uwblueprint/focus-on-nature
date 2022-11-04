import React, { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import CampDetails from "./CampDetails";
import ScheduleSessions from "./ScheduleSessions";
import RegistrationForm from "./RegistrationForm";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { FormTemplate } from "../../../types/AdminTypes";

enum CampCreationPages {
  CampCreationDetailsPage,
  ScheduleSessionsPage,
  RegistrationFormPage,
}

const CampCreationPage = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<CampCreationPages>(
    CampCreationPages.CampCreationDetailsPage,
  );


  const [formTemplateQuestions, setFormTemplateQuestions] = useState<FormTemplate>();

  useEffect(() => {
    const getFormTemplate = async () => {
      const formTemplate = await AdminAPIClient.getFormTemplate();
      if (formTemplate) {
        setFormTemplateQuestions(formTemplate);
      }
    };

    getFormTemplate();
  }, []);

  const getCampCreationStepComponent = (nextPage: CampCreationPages) => {
    // will also need logic blocking pages if current page not complete
    switch (nextPage) {
      case CampCreationPages.CampCreationDetailsPage:
        return <CampDetails />;
      case CampCreationPages.ScheduleSessionsPage:
        return <ScheduleSessions />;
      case CampCreationPages.RegistrationFormPage:
        return <RegistrationForm campQuestions={formTemplateQuestions? formTemplateQuestions.formQuestions : []}/>;
      default:
        throw new Error("never reached");
    }
  };

  return (
    <Box>
      <Button
        onClick={() =>
          setCurrentPage(CampCreationPages.CampCreationDetailsPage)
        }
      >
        Camp Details
      </Button>
      <Button
        onClick={() => setCurrentPage(CampCreationPages.ScheduleSessionsPage)}
      >
        Schedule Sessions
      </Button>
      <Button
        onClick={() => setCurrentPage(CampCreationPages.RegistrationFormPage)}
      >
        Registration Form
      </Button>

      <Box my="50px" mx="228px">
        {getCampCreationStepComponent(currentPage)}
      </Box>
    </Box>
  );
};

export default CampCreationPage;
