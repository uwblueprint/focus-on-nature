import React from "react";
import { Button, Flex, Spacer } from "@chakra-ui/react";
import CampCreationPages from "./CampCreationPages";

export type CampCreationFooterProps = {
  currentStep: CampCreationPages;
  isCurrentStepCompleted: boolean;
  handleStepNavigation: (stepsToMove: number) => void;
  isEditingCamp: boolean;
  createUpdateCamp: (
    isPublishedCamp: boolean,
    isNewCamp: boolean,
  ) => Promise<void>;
  setShowCreationErrors: React.Dispatch<React.SetStateAction<boolean>>;
};

const CampCreationFooter = ({
  currentStep,
  isCurrentStepCompleted,
  handleStepNavigation,
  createUpdateCamp,
  isEditingCamp,
  setShowCreationErrors,
}: CampCreationFooterProps): React.ReactElement => {
  const [isAwaitingReq, setIsAwaitingReq] = React.useState(false);

  const onSave = async (isPublishedCamp: boolean) => {
    const isNewCamp = !isEditingCamp;
    setIsAwaitingReq(true);
    await createUpdateCamp(isPublishedCamp, isNewCamp);
    setIsAwaitingReq(false);
  };

  const onNextStep = async () => {
    if (!isCurrentStepCompleted) {
      setShowCreationErrors(true);
      return;
    }
    handleStepNavigation(1);

    if (currentStep === CampCreationPages.RegistrationFormPage) {
      onSave(true);
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
          onClick={() => onSave(false)}
          isLoading={isAwaitingReq}
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
        background={
          isCurrentStepCompleted
            ? "primary.green.100"
            : "primary.green_disabled.100"
        }
        _hover={{ cursor: isCurrentStepCompleted ? "pointer" : "not-allowed" }}
        isLoading={
          isAwaitingReq &&
          currentStep === CampCreationPages.RegistrationFormPage
        }
      >
        {currentStep === CampCreationPages.RegistrationFormPage
          ? "Publish"
          : "Next"}
      </Button>
    </Flex>
  );
};

export default CampCreationFooter;
