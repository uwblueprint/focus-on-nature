import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import CampDetails from "./CampDetails";
import ScheduleSessions from "./ScheduleSessions";
import RegistrationForm from "./RegistrationForm";

enum CampCreationPages {
  CampCreationDetailsPage,
  ScheduleSessionsPage,
  RegistrationFormPage,
}

const CampCreationPage = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<CampCreationPages>(
    CampCreationPages.CampCreationDetailsPage,
  );

  const getCampCreationStepComponent = (nextPage: CampCreationPages) => {
    // will also need logic blocking pages if current page not complete
    switch (nextPage) {
      case CampCreationPages.CampCreationDetailsPage:
        return <CampDetails />;
      case CampCreationPages.ScheduleSessionsPage:
        return <ScheduleSessions />;
      case CampCreationPages.RegistrationFormPage:
        return <RegistrationForm />;
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
