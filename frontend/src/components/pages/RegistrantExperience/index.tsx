import React, { useState } from "react";

import { Box } from "@chakra-ui/react";
import PersonalInfo from "./PersonalInfo";
import AdditionalInfo from "./AdditionalInfo";
import Waiver from "./Waiver";
import ReviewRegistration from "./ReviewRegistration";
import RegistrationNavStepper from "./RegistrationNavStepper";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";

const RegistrantExperiencePage = (): React.ReactElement => {
  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );

  const [samplePersonalInfo, setSamplePersonalInfo] = useState(false);
  const [sampleAdditionalInfo, setSampleAdditionalInfo] = useState(false);
  const [sampleWaiverField, setSampleWaiverField] = useState(false);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);

  const isPersonalInfoFilled = samplePersonalInfo;
  const isAdditionalInfoFilled = sampleAdditionalInfo;
  const isWaiverFilled = sampleWaiverField;
  const isReviewRegistrationFilled = sampleRegisterField;

  const getCurrentRegistrantStepComponent = (
    step: RegistrantExperienceSteps,
  ) => {
    switch (step) {
      case RegistrantExperienceSteps.PersonalInfoPage:
        return (
          <PersonalInfo
            isChecked={samplePersonalInfo}
            toggleChecked={() => setSamplePersonalInfo(!samplePersonalInfo)}
          />
        );
      case RegistrantExperienceSteps.AdditionalInfoPage:
        return (
          <AdditionalInfo
            isChecked={sampleAdditionalInfo}
            toggleChecked={() => setSampleAdditionalInfo(!sampleAdditionalInfo)}
          />
        );
      case RegistrantExperienceSteps.WaiverPage:
        return (
          <Waiver
            isChecked={sampleWaiverField}
            toggleChecked={() => setSampleWaiverField(!sampleWaiverField)}
          />
        );
      case RegistrantExperienceSteps.ReviewRegistrationPage:
        return (
          <ReviewRegistration
            isChecked={sampleRegisterField}
            toggleChecked={() => setSampleRegisterField(!sampleRegisterField)}
          />
        );
      default:
        throw new Error("unexpected page");
    }
  };

  return (
    <Box>
      <RegistrationNavStepper
        currentStep={currentStep}
        isPersonalInfoFilled={isPersonalInfoFilled}
        isAdditionalInfoFilled={isAdditionalInfoFilled}
        isWaiverFilled={isWaiverFilled}
        isReviewRegistrationFilled={isReviewRegistrationFilled}
        setCurrentStep={setCurrentStep}
      />

      <Box my="50px" mx="228px">
        {getCurrentRegistrantStepComponent(currentStep)}
      </Box>
    </Box>
  );
};

export default RegistrantExperiencePage;
