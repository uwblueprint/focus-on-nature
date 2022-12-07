import React from "react";
import { Button, Flex, Spacer } from "@chakra-ui/react";
import CampCreationPages from "./CampCreationPages";

export type CampCreationFooterProps = {
  currentStep: CampCreationPages;
  isCurrentStepCompleted: boolean;
  handleStepNavigation: (stepsToMove: number) => void;
};

const CampCreationFooter = ({
  currentStep,
  isCurrentStepCompleted,
  handleStepNavigation,
}: CampCreationFooterProps): React.ReactElement => {
  const onNextStep = () => {
    handleStepNavigation(1);
    if (currentStep === CampCreationPages.RegistrationFormPage) {
      // eslint-disable-next-line no-console
      console.log("Publish camp."); // Temporary.
    }
  };

  return (
    <Flex
      bg="white"
      boxShadow="sm"
      minH="92px"
      width="100vw"
      align="center"
      flexWrap="wrap"
      padding="20px"
      pr="40px"
      pl="40px"
      position="fixed"
      bottom="0"
      zIndex="11"
    >
      <Button
        width="auto"
        height="48px"
        variant="secondary"
        onClick={() => handleStepNavigation(-1)}
        disabled // Temporary.
      >
        Save as draft
      </Button>
      <Spacer />
      <Button
        width="auto"
        height="48px"
        variant="secondary"
        onClick={() => handleStepNavigation(-1)}
        mr={4}
        disabled={currentStep === CampCreationPages.CampCreationDetailsPage}
      >
        Back
      </Button>
      <Button
        width="auto"
        height="48px"
        variant="primary"
        onClick={onNextStep}
        disabled={!isCurrentStepCompleted}
      >
        {currentStep === CampCreationPages.RegistrationFormPage
          ? "Publish"
          : "Next"}
      </Button>
    </Flex>
  );
};

export default CampCreationFooter;
