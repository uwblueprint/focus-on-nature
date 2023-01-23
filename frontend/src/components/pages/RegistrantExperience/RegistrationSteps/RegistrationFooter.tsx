import React from "react";
import { Button, Flex, useToast } from "@chakra-ui/react";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";

export type RegistrationFooterProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  currentStep: RegistrantExperienceSteps;
  isCurrentStepCompleted: boolean;
  registrationLoading: boolean;
  handleStepNavigation: (stepsToMove: number) => void;
  isPaymentSummary: boolean;
  isWaitlistRegistration: boolean;
};

const RegistrationFooter = ({
  nextBtnRef,
  currentStep,
  isCurrentStepCompleted,
  registrationLoading,
  handleStepNavigation,
  isPaymentSummary,
  isWaitlistRegistration,
}: RegistrationFooterProps): React.ReactElement => {
  const toast = useToast();

  const onNextStep = () => {
    if (isCurrentStepCompleted) {
      handleStepNavigation(1);
    } else {
      toast({
        title: "Form does not pass validation.",
        description:
          "Please complete all form fields according to requirements.",
        variant: "subtle",
        duration: 3000,
        status: "error",
        position: "top",
      });
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
      {!(
        isWaitlistRegistration &&
        currentStep === RegistrantExperienceSteps.PersonalInfoPage
      ) && (
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
      )}
      <Button
        ref={nextBtnRef}
        width={{ sm: "95vw", md: "45vw", lg: "auto" }}
        mr={{ sm: 0, lg: 4 }}
        height="48px"
        variant="primary"
        isLoading={registrationLoading}
        loadingText="Submitting"
        onClick={onNextStep}
      >
        {currentStep === RegistrantExperienceSteps.ReviewRegistrationPage &&
        isPaymentSummary
          ? "Go to checkout"
          : "Next"}
      </Button>
    </Flex>
  );
};

export default RegistrationFooter;
