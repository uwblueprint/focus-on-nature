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
};

const CampCreationFooter = ({
  currentStep,
  isCurrentStepCompleted,
  handleStepNavigation,
  createUpdateCamp,
  isEditingCamp,
}: CampCreationFooterProps): React.ReactElement => {
  const [isAwaitingReq, setIsAwaitingReq] = React.useState(false);

  const onNextStep = async () => {
    handleStepNavigation(1);

    if (currentStep === CampCreationPages.RegistrationFormPage) {
      const isPublishedCamp = true;
      const isNewCamp = !isEditingCamp;
      setIsAwaitingReq(true);
      await createUpdateCamp(isPublishedCamp, isNewCamp);
      setIsAwaitingReq(false);
    }
  };

  const onSaveAsDraft = async () => {
    const isNewCamp = !isEditingCamp;
    const isPublishedCamp = false;
    setIsAwaitingReq(true);
    await createUpdateCamp(isPublishedCamp, isNewCamp);
    setIsAwaitingReq(false);
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
        disabled={!isCurrentStepCompleted}
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
