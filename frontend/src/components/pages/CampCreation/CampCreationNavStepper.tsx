import React from "react";
import { Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCampground,
  faCalendarDays,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import StepperTab from "../../common/StepperNavigation/StepperTab";
import CampCreationPages, {
  CAMP_CREATION_NUM_STEPS,
} from "./CampCreationPages";

type CampCreationNavStepperProps = {
  currentPage: CampCreationPages;
  setCurrentPage: React.Dispatch<React.SetStateAction<CampCreationPages>>;
  isCampDetailsFilled: boolean;
  isScheduleSessionsFilled: boolean;
  isRegistrationFormFilled: boolean;
};

const CampCreationNavStepper = ({
  currentPage,
  setCurrentPage,
  isCampDetailsFilled,
  isScheduleSessionsFilled,
  isRegistrationFormFilled,
}: CampCreationNavStepperProps): React.ReactElement => {
  return (
    <Flex
      bg="white"
      boxShadow="sm"
      minH="92px"
      width="100vw"
      align="center"
      justify="space-between"
      flexWrap="wrap"
      px="200px"
    >
      <StepperTab
        title="Camp Details"
        stepNum={1}
        totalSteps={CAMP_CREATION_NUM_STEPS}
        filled={isCampDetailsFilled}
        focused={currentPage === CampCreationPages.CampCreationDetailsPage}
        available
        icon={<FontAwesomeIcon icon={faCampground} />}
        onClick={() =>
          setCurrentPage(CampCreationPages.CampCreationDetailsPage)
        }
      />
      <StepperTab
        title="Schedule Sessions"
        stepNum={2}
        totalSteps={CAMP_CREATION_NUM_STEPS}
        filled={isScheduleSessionsFilled}
        focused={currentPage === CampCreationPages.ScheduleSessionsPage}
        available={isCampDetailsFilled}
        icon={<FontAwesomeIcon icon={faCalendarDays} />}
        onClick={() => setCurrentPage(CampCreationPages.ScheduleSessionsPage)}
      />
      <StepperTab
        title="Registration Form"
        stepNum={3}
        totalSteps={CAMP_CREATION_NUM_STEPS}
        filled={isRegistrationFormFilled}
        focused={currentPage === CampCreationPages.RegistrationFormPage}
        available={isCampDetailsFilled && isScheduleSessionsFilled}
        icon={<FontAwesomeIcon icon={faCircleInfo} />}
        onClick={() => setCurrentPage(CampCreationPages.RegistrationFormPage)}
      />
    </Flex>
  );
};

export default CampCreationNavStepper;
