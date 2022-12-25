import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";

export type RegistrationFooterProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  currentStep: RegistrantExperienceSteps;
  isCurrentStepCompleted: boolean;
  handleStepNavigation: (stepsToMove: number) => void;
};

const RegistrationFooter = ({
  nextBtnRef,
  currentStep,
  isCurrentStepCompleted,
  handleStepNavigation,
}: RegistrationFooterProps): React.ReactElement => {
  const onNextStep = () => {
    if (isCurrentStepCompleted) {
      handleStepNavigation(1);
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
      >
        Back
      </Button>
      <Button
        ref={nextBtnRef}
        width={{ sm: "95vw", md: "45vw", lg: "auto" }}
        height="48px"
        variant="primary"
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
