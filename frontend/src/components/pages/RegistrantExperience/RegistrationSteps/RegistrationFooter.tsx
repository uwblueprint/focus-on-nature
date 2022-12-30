import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";

export type RegistrationFooterProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  currentStep: RegistrantExperienceSteps;
  isCurrentStepCompleted: boolean;
  registrationLoading: boolean;
  handleStepNavigation: (stepsToMove: number) => void;
};

const RegistrationFooter = ({
  nextBtnRef,
  currentStep,
  isCurrentStepCompleted,
  registrationLoading,
  handleStepNavigation,
}: RegistrationFooterProps): React.ReactElement => {
  const onNextStep = () => {
    if (isCurrentStepCompleted) {
      handleStepNavigation(1);
    } else {
      alert(
        "Form does not pass validation. Please complete all form fields according to requirements.",
      );
    }
  };

  return (
    <Flex
      bg="white"
      boxShadow="sm"
      minH="92px"
      width="100vw"
      align="center"
      justify={{ sm: "center", lg: "end" }}
      flexWrap="wrap"
      padding="20px"
      position="fixed"
      bottom="0"
      zIndex="5"
    >
      <Button
        width={{ sm: "95vw", md: "45vw", lg: "auto" }}
        height="48px"
        variant="secondary"
        onClick={() => handleStepNavigation(-1)}
        mb={{ sm: 4, md: 0 }}
        mr={{ sm: 0, md: 4 }}
        disabled={registrationLoading}
      >
        Back
      </Button>
      <Button
        ref={nextBtnRef}
        width={{ sm: "95vw", md: "45vw", lg: "auto" }}
        height="48px"
        variant="primary"
        isLoading={registrationLoading}
        loadingText="Submitting"
        onClick={onNextStep}
      >
        {currentStep === RegistrantExperienceSteps.ReviewRegistrationPage
          ? "Go to checkout"
          : "Next"}
      </Button>
    </Flex>
  );
};

export default RegistrationFooter;
