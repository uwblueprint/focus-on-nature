import React from "react";
import { Box, Center } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCampground,
  faCalendarDays,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import StepperTab from "./StepperTab";

export enum CampCreationPages {
  CampCreationDetailsPage,
  ScheduleSessionsPage,
  RegistrationFormPage,
}

type StepperProps = {
  currentPage: CampCreationPages;
  setCurrentPage: React.Dispatch<React.SetStateAction<CampCreationPages>>;
  isCampDetailsFilled: boolean;
  isScheduleSessionsFilled: boolean;
  isRegistrationFormFilled: boolean;
};

const Stepper = ({
  currentPage,
  setCurrentPage,
  isCampDetailsFilled,
  isScheduleSessionsFilled,
  isRegistrationFormFilled,
}: StepperProps): React.ReactElement => {
  return (
    <Box bg="white" maxW="100%" boxShadow="sm">
      <Center>
        <StepperTab
          title="Camp Details"
          stepNum={1}
          focused={currentPage === CampCreationPages.CampCreationDetailsPage}
          icon={<FontAwesomeIcon icon={faCampground} />}
          onClick={() => setCurrentPage(CampCreationPages.CampCreationDetailsPage)}
        />
        <StepperTab
          title="Schedule Sessions"
          stepNum={2}
          focused={currentPage === CampCreationPages.ScheduleSessionsPage}
          icon={<FontAwesomeIcon icon={faCalendarDays} />}
          onClick={() =>
            isCampDetailsFilled &&
            setCurrentPage(CampCreationPages.ScheduleSessionsPage)
          }
        />
        <StepperTab
          title="Registration Form"
          stepNum={3}
          focused={currentPage === CampCreationPages.RegistrationFormPage}
          icon={<FontAwesomeIcon icon={faCircleInfo} />}
          onClick={() =>
            isCampDetailsFilled &&
            isScheduleSessionsFilled &&
            setCurrentPage(CampCreationPages.RegistrationFormPage)
          }
        />
      </Center>
    </Box>
  );
};

export default Stepper;
