import React, { useState } from "react";

import { Box, Button } from "@chakra-ui/react";
import PersonalInfo from "./PersonalInfo";
import AdditionalInfo from "./AdditionalInfo";
import Waiver from "./Waiver";
import ReviewRegistration from "./ReviewRegistration";

enum RegistrantExperienceSteps {
  PersonalInfoPage,
  AdditionalInfoPage,
  WaiverPage,
  ReviewRegistrationPage,
}

const RegistrantExperiencePage = (): React.ReactElement => {
  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );

  const getCurrentRegistrantStepComponent = (
    step: RegistrantExperienceSteps,
  ) => {
    switch (step) {
      case RegistrantExperienceSteps.PersonalInfoPage:
        return <PersonalInfo />;
      case RegistrantExperienceSteps.AdditionalInfoPage:
        return <AdditionalInfo />;
      case RegistrantExperienceSteps.WaiverPage:
        return <Waiver />;
      case RegistrantExperienceSteps.ReviewRegistrationPage:
        return <ReviewRegistration />;
      default:
        throw new Error("unexpected page");
    }
  };

  return (
    <Box>
      <Button
        onClick={() =>
          setCurrentStep(RegistrantExperienceSteps.PersonalInfoPage)
        }
      >
        Personal Info
      </Button>
      <Button
        onClick={() =>
          setCurrentStep(RegistrantExperienceSteps.AdditionalInfoPage)
        }
      >
        Additional Info
      </Button>
      <Button
        onClick={() => setCurrentStep(RegistrantExperienceSteps.WaiverPage)}
      >
        Waiver
      </Button>
      <Button
        onClick={() =>
          setCurrentStep(RegistrantExperienceSteps.ReviewRegistrationPage)
        }
      >
        Review &amp; Pay
      </Button>

      <Box my="50px" mx="228px">
        {getCurrentRegistrantStepComponent(currentStep)}
      </Box>
    </Box>
  );
};

export default RegistrantExperiencePage;
