import React from "react";
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Hide,
  HStack,
  Show,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  faCampground,
  faCircleInfo,
  faDollarSign,
  faEdit,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StepperTab from "../../common/StepperNavigation/StepperTab";
import RegistrantExperienceSteps, {
  StepperPageDetails,
  REGISTRATION_NUM_STEPS,
} from "./RegistrationExperienceSteps";

const STEPPER_TITLES = {
  PersonalInfo: "Personal Info",
  AdditionalInfo: "Additional Info",
  Waiver: "Waiver",
  Review: "Review & Pay",
};

export type RegistrationNavStepperProps = {
  currentStep: RegistrantExperienceSteps;
  isPersonalInfoFilled: boolean;
  isAdditionalInfoFilled: boolean;
  isWaiverFilled: boolean;
  isReviewRegistrationFilled: boolean;
  setCurrentStep: (step: RegistrantExperienceSteps) => void;
};

const getPageDetails = (
  step: RegistrantExperienceSteps,
  isPersonalInfoFilled: boolean,
  isAdditionalInfoFilled: boolean,
  isWaiverFilled: boolean,
  isReviewRegistrationFilled: boolean,
  isAdditionalInfoAvailable = true,
  isWaiverAvailable = true,
  isReviewRegistrationAvailable = true,
): StepperPageDetails => {
  switch (step) {
    case RegistrantExperienceSteps.PersonalInfoPage:
      return {
        pageName: STEPPER_TITLES.PersonalInfo,
        nextPageName: STEPPER_TITLES.AdditionalInfo,
        pageNumber: 1,
        progress: 25,
        isFilled: isPersonalInfoFilled,
        isAvailable: true,
        icon: <FontAwesomeIcon icon={faCampground} />,
      };
    case RegistrantExperienceSteps.AdditionalInfoPage:
      return {
        pageName: STEPPER_TITLES.AdditionalInfo,
        nextPageName: STEPPER_TITLES.Waiver,
        pageNumber: 2,
        progress: 50,
        isFilled: isAdditionalInfoFilled,
        isAvailable: isAdditionalInfoAvailable,
        icon: <FontAwesomeIcon icon={faCircleInfo} />,
      };
    case RegistrantExperienceSteps.WaiverPage:
      return {
        pageName: STEPPER_TITLES.Waiver,
        nextPageName: STEPPER_TITLES.Review,
        pageNumber: 3,
        progress: 75,
        isFilled: isWaiverFilled,
        isAvailable: isWaiverAvailable,
        icon: <FontAwesomeIcon icon={faEdit} />,
      };
    case RegistrantExperienceSteps.ReviewRegistrationPage:
      return {
        pageName: STEPPER_TITLES.Review,
        nextPageName: "Checkout",
        pageNumber: 4,
        progress: 100,
        isFilled: isReviewRegistrationFilled,
        isAvailable: isReviewRegistrationAvailable,
        icon: <FontAwesomeIcon icon={faDollarSign} />,
      };
    default:
      throw new Error("unexpected page");
  }
};

const NavStepper = ({
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

  const steps = [
    RegistrantExperienceSteps.PersonalInfoPage,
    RegistrantExperienceSteps.AdditionalInfoPage,
    RegistrantExperienceSteps.WaiverPage,
    RegistrantExperienceSteps.ReviewRegistrationPage,
  ];

  return (
    <>
      {steps.map((step) => {
        const pageDetails = getPageDetails(
          step,
          isPersonalInfoFilled,
          isAdditionalInfoFilled,
          isWaiverFilled,
          isReviewRegistrationFilled,
          isAdditionalInfoAvailable,
          isWaiverAvailable,
          isReviewRegistrationAvailable,
        );

        return (
          <StepperTab
            key={pageDetails.pageName}
            title={pageDetails.pageName}
            stepNum={pageDetails.pageNumber}
            totalSteps={REGISTRATION_NUM_STEPS}
            filled={pageDetails.isFilled}
            focused={currentStep === step}
            available={pageDetails.isAvailable}
            icon={pageDetails.icon}
            onClick={() => setCurrentStep(step)}
          />
        );
      })}
    </>
  );
};

const MobileStepper = ({
  currentStep,
  isPersonalInfoFilled,
  isAdditionalInfoFilled,
  isWaiverFilled,
  isReviewRegistrationFilled,
}: RegistrationNavStepperProps): React.ReactElement => {
  const pageDetails = getPageDetails(
    currentStep,
    isPersonalInfoFilled,
    isAdditionalInfoFilled,
    isWaiverFilled,
    isReviewRegistrationFilled,
  );

  const stepperTitle = `${pageDetails.pageName} (${pageDetails.pageNumber}/${REGISTRATION_NUM_STEPS})`;

  return (
    <HStack flex="1" spacing={4} m={4} justify="flex-start">
      <CircularProgress
        value={pageDetails.progress}
        color="stepper.focused.500"
      >
        <CircularProgressLabel>
          {pageDetails.isFilled ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            pageDetails.icon
          )}
        </CircularProgressLabel>
      </CircularProgress>
      <VStack my={3} spacing={1} align="flex-start">
        <Text textStyle="xSmallBold">{stepperTitle}</Text>
        <Text textStyle="xSmallRegular">Next: {pageDetails.nextPageName}</Text>
      </VStack>
    </HStack>
  );
};

const RegistrationNavStepper = ({
  currentStep,
  isPersonalInfoFilled,
  isAdditionalInfoFilled,
  isWaiverFilled,
  isReviewRegistrationFilled,
  setCurrentStep,
}: RegistrationNavStepperProps): React.ReactElement => {
  return (
    <Flex
      bg="white"
      boxShadow="sm"
      minH="92px"
      width="100vw"
      position="fixed"
      top="0"
      zIndex="5"
      alignItems="center"
    >
      <Show below="md">
        <MobileStepper
          currentStep={currentStep}
          isPersonalInfoFilled={isPersonalInfoFilled}
          isAdditionalInfoFilled={isAdditionalInfoFilled}
          isWaiverFilled={isWaiverFilled}
          isReviewRegistrationFilled={isReviewRegistrationFilled}
          setCurrentStep={setCurrentStep}
        />
      </Show>
      <Hide below="md">
        <Flex
          flex="1"
          align="center"
          justify="space-between"
          mx={{ md: "5vw", lg: "10vw" }}
        >
          <NavStepper
            currentStep={currentStep}
            isPersonalInfoFilled={isPersonalInfoFilled}
            isAdditionalInfoFilled={isAdditionalInfoFilled}
            isWaiverFilled={isWaiverFilled}
            isReviewRegistrationFilled={isReviewRegistrationFilled}
            setCurrentStep={setCurrentStep}
          />
        </Flex>
      </Hide>
    </Flex>
  );
};

export default RegistrationNavStepper;
