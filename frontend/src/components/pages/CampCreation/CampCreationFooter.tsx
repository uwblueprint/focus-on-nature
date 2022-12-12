import React from "react";
import { Button, Flex, Spacer } from "@chakra-ui/react";
import CampCreationPages from "./CampCreationPages";

export type CampCreationFooterProps = {
  currentStep: CampCreationPages;
  isCurrentStepCompleted: boolean;
  handleStepNavigation: (stepsToMove: number) => void;
  isEditingCamp: boolean;
  createNewCamp: (isPublishedCamp: boolean) => Promise<void>;
};

const CampCreationFooter = ({
  currentStep,
  isCurrentStepCompleted,
  handleStepNavigation,
  createNewCamp,
  isEditingCamp,
}: CampCreationFooterProps): React.ReactElement => {
  const onNextStep = async () => {
    handleStepNavigation(1);

    if (currentStep === CampCreationPages.RegistrationFormPage) {
      // Publishing a new camp
      if (!isEditingCamp) {
        createNewCamp(true);
      } else {
        // Publishing a draft camp (should update the camp, not create a new camp)
        console.log("Converting a draft camp to a published camp");
      }
    }
  };

  const onSaveAsDraft = async () => {
    // Saving a new camp as draft
    if (!isEditingCamp) {
      createNewCamp(false);
    } else {
      // Saving a draft camp (should update the camp, not create a new camp)
      console.log("Saving progress on a draft camp");
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
      {currentStep !== CampCreationPages.CampCreationDetailsPage && (
        <Button
          width="auto"
          height="48px"
          variant="secondary"
          onClick={() => onSaveAsDraft()}
        >
          Save as draft
        </Button>
      )}
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
