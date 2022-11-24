import React from "react";
import { Flex } from "@chakra-ui/react";
import {
  faCampground,
  faCircleInfo,
  faDollarSign,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StepperTab from "../../common/StepperNavigation/StepperTab";
import RegistrantExperienceSteps, {
  REGISTRATION_NUM_STEPS,
} from "./RegistrationExperienceSteps";

export type RegistrationNavStepperProps = {
  currentStep: RegistrantExperienceSteps;
  isPersonalInfoFilled: boolean;
  isAdditionalInfoFilled: boolean;
  isWaiverFilled: boolean;
  isReviewRegistrationFilled: boolean;
  setCurrentStep: (step: RegistrantExperienceSteps) => void;
};

const RegistrationNavStepper = ({
  currentStep,
  isPersonalInfoFilled,
  isAdditionalInfoFilled,
  isWaiverFilled,
  isReviewRegistrationFilled,
  setCurrentStep,
}: RegistrationNavStepperProps): React.ReactElement => {
  const isAdditionalInfoAvailable = isPersonalInfoFilled;
  const isWaiverAvailable = isPersonalInfoFilled && isAdditionalInfoFilled;
  const isReviewRegistrationAvailable =
    isPersonalInfoFilled && isAdditionalInfoFilled && isWaiverFilled;

  return (
    <Flex
      bg="white"
      boxShadow="sm"
      minH="92px"
      width="100vw"
      align="center"
      justify="center"
      flexWrap="wrap"
    >
      <StepperTab
        title="Personal Info"
        stepNum={1}
        totalSteps={REGISTRATION_NUM_STEPS}
        filled={isPersonalInfoFilled}
        focused={currentStep === RegistrantExperienceSteps.PersonalInfoPage}
        available
        icon={<FontAwesomeIcon icon={faCampground} />}
        onClick={() =>
          setCurrentStep(RegistrantExperienceSteps.PersonalInfoPage)
        }
        marginLeft="0px"
        marginRight="6vw"
      />
      <StepperTab
        title="Additional Info"
        stepNum={2}
        totalSteps={REGISTRATION_NUM_STEPS}
        filled={isAdditionalInfoFilled}
        focused={currentStep === RegistrantExperienceSteps.AdditionalInfoPage}
        available={isAdditionalInfoAvailable}
        icon={<FontAwesomeIcon icon={faCircleInfo} />}
        onClick={() =>
          setCurrentStep(RegistrantExperienceSteps.AdditionalInfoPage)
        }
        marginLeft="6vw"
        marginRight="6vw"
      />
      <StepperTab
        title="Waiver"
        stepNum={3}
        totalSteps={REGISTRATION_NUM_STEPS}
        filled={isWaiverFilled}
        focused={currentStep === RegistrantExperienceSteps.WaiverPage}
        available={isWaiverAvailable}
        icon={<FontAwesomeIcon icon={faEdit} />}
        onClick={() => setCurrentStep(RegistrantExperienceSteps.WaiverPage)}
        marginLeft="6vw"
        marginRight="6vw"
      />
      <StepperTab
        title="Review &amp; Pay"
        stepNum={4}
        totalSteps={REGISTRATION_NUM_STEPS}
        filled={isReviewRegistrationFilled}
        focused={
          currentStep === RegistrantExperienceSteps.ReviewRegistrationPage
        }
        available={isReviewRegistrationAvailable}
        icon={<FontAwesomeIcon icon={faDollarSign} />}
        onClick={() =>
          setCurrentStep(RegistrantExperienceSteps.ReviewRegistrationPage)
        }
        marginLeft="6vw"
        marginRight="0px"
      />
    </Flex>
  );
};

export default RegistrationNavStepper;
