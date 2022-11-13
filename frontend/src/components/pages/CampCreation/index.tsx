import React, { useEffect, useState } from "react";
import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
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
    <Flex flexDirection="column" minHeight="calc(100vh - 68px)">
      {/* Stepper */}
      <Box bg="#dddddd" height="92px">
        <Button onClick={() => setCurrentPage(CampCreationPages.CampCreationDetailsPage)}>
          Camp Details
        </Button>
        <Button onClick={() => setCurrentPage(CampCreationPages.ScheduleSessionsPage)}>
          Schedule Sessions
        </Button>
        <Button onClick={() => setCurrentPage(CampCreationPages.RegistrationFormPage)}>
          Registration Form
        </Button>
      </Box>

      {/* Page */}
      <Box  pt="75px" pl="200px" pr="200px" maxHeight="calc(100vh - 260px)" flexGrow={1} overflowY={currentPage === CampCreationPages.RegistrationFormPage ? "scroll" : "auto"}>
        {getCampCreationStepComponent(currentPage)}
      </Box>

      {/* Footer */}
      <Box as="footer" bg="#dddddd" height="100px" >
        footer
      </Box>

    </Flex>
  );
};

export default CampCreationPage;
