import React from "react";
import { Box, Center } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCampground,
  faCalendarDays,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import StepperTab from "./StepperTab";
import { CampCreationPages } from "../CampCreationPages";

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
      <Box bg="white" boxShadow="sm" height="92px">
        <Center>
            <StepperTab
              title="Camp Details"
              stepNum={1}
              filled={isCampDetailsFilled}
              focused={currentPage === CampCreationPages.CampCreationDetailsPage}
              available
              icon={<FontAwesomeIcon icon={faCampground} />}
              onClick={() =>
                setCurrentPage(CampCreationPages.CampCreationDetailsPage)
              }
              marginLeft="0px"
              marginRight="10vw"
            />
            <StepperTab
              title="Schedule Sessions"
              stepNum={2}
              filled={isScheduleSessionsFilled}
              focused={currentPage === CampCreationPages.ScheduleSessionsPage}
              available={isCampDetailsFilled}
              icon={<FontAwesomeIcon icon={faCalendarDays} />}
              onClick={() => setCurrentPage(CampCreationPages.ScheduleSessionsPage)}
              marginLeft="10vw"
              marginRight="10vw"
            />
            <StepperTab
              title="Registration Form"
              stepNum={3}
              filled={isRegistrationFormFilled}
              focused={currentPage === CampCreationPages.RegistrationFormPage}
              available={isCampDetailsFilled && isScheduleSessionsFilled}
              icon={<FontAwesomeIcon icon={faCircleInfo} />}
              onClick={() => setCurrentPage(CampCreationPages.RegistrationFormPage)}
              marginLeft="10vw"
              marginRight="0px"
            />
        </Center>
      </Box>
  );
};

export default Stepper;
