import React, { useEffect, useState, useReducer, Reducer } from "react";
import { useParams } from "react-router-dom";

import { Box, Text, Spinner, Flex } from "@chakra-ui/react";
import PersonalInfo from "./PersonalInfo";
import AdditionalInfo from "./AdditionalInfo";
import Waiver from "./Waiver";
import ReviewRegistration from "./ReviewRegistration";
import RegistrationNavStepper from "./RegistrationNavStepper";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";
import RegistrationFooter from "./RegistrationFooter";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import {
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../types/waiverTypes";
import waiverReducer from "./Waiver/WaiverReducer";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CampResponse } from "../../../types/CampsTypes";

const RegistrantExperiencePage = (): React.ReactElement => {
  const { id: campId } = useParams<{ id: string }>();

  const [camp, setCamp] = useState<CampResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );
  const [waiverInterface, waiverDispatch] = useReducer<
    Reducer<WaiverInterface, WaiverReducerDispatch>
  >(waiverReducer, {
    // TODO: Add support to Waiver and WaiverReducer to get the actual name of the camp being accesses.
    campName: camp?.name,
    waiver: undefined,
    optionalClauses: [],
    requiredClauses: [],
    agreedRequiredClauses: false,
    loadingWaiver: true,
    date: "",
    name: "",
    waiverCompleted: false,
  });
  useEffect(() => {
    CampsAPIClient.getCampById(campId).then((campResponse) => {
      if (campResponse.id) {
        setCamp(campResponse);
      }
      setIsLoading(false);
    });

    AdminAPIClient.getWaiver().then((waiver) => {
      waiverDispatch({
        type: WaiverActions.LOADED_WAIVER,
        waiver,
      });
    });
  }, [campId]);

  const [samplePersonalInfo, setSamplePersonalInfo] = useState(false);
  const [sampleAdditionalInfo, setSampleAdditionalInfo] = useState(false);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);

  const isPersonalInfoFilled = samplePersonalInfo;
  const isAdditionalInfoFilled = sampleAdditionalInfo;
  const isWaiverFilled = waiverInterface.waiverCompleted;
  const isReviewRegistrationFilled = sampleRegisterField;

  const isCurrentStepCompleted = (step: RegistrantExperienceSteps) => {
    switch (step) {
      case RegistrantExperienceSteps.PersonalInfoPage:
        return isPersonalInfoFilled;
      case RegistrantExperienceSteps.AdditionalInfoPage:
        return isAdditionalInfoFilled;
      case RegistrantExperienceSteps.WaiverPage:
        return isWaiverFilled;
      case RegistrantExperienceSteps.ReviewRegistrationPage:
        return isReviewRegistrationFilled;
      default:
        return false;
    }
  };

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
            waiverInterface={waiverInterface}
            waiverDispatch={waiverDispatch}
            campName={camp?.name || ""}
          />
        );
      case RegistrantExperienceSteps.ReviewRegistrationPage:
        return (
          <ReviewRegistration
            isChecked={sampleRegisterField}
            toggleChecked={() => setSampleRegisterField(!sampleRegisterField)}
            campName={camp?.name || ""}
          />
        );
      default:
        throw new Error("unexpected page");
    }
  };

  const handleStepNavigation = (stepsToMove: number) => {
    const desiredStep = currentStep + stepsToMove;
    if (RegistrantExperienceSteps[desiredStep]) {
      setCurrentStep(currentStep + stepsToMove);
    } else if (desiredStep < 0) {
      alert("PLACEHOLDER - go to initial registration");
    } else {
      alert("PLACEHOLDER - go to payment");
    }
  };

  return (
    <Flex
      direction="column"
      w="100vw"
      pt={{ sm: "120px", md: "120px", lg: "144px" }}
      pb={{ sm: "170px", md: "108px", lg: "144px" }}
      justifyContent="flex-start"
    >
      <RegistrationNavStepper
        currentStep={currentStep}
        isPersonalInfoFilled={isPersonalInfoFilled}
        isAdditionalInfoFilled={isAdditionalInfoFilled}
        isWaiverFilled={isWaiverFilled}
        isReviewRegistrationFilled={isReviewRegistrationFilled}
        setCurrentStep={setCurrentStep}
      />
      {!isLoading && (
        <Box mx="10vw">
          {camp ? (
            getCurrentRegistrantStepComponent(currentStep)
          ) : (
            <Text>Error: Camp not found. Please go back and try again.</Text>
          )}
        </Box>
      )}

      {isLoading && <Spinner justifySelf="center" />}
      <RegistrationFooter
        currentStep={currentStep}
        isCurrentStepCompleted={isCurrentStepCompleted(currentStep)}
        handleStepNavigation={handleStepNavigation}
      />
    </Flex>
  );
};

export default RegistrantExperiencePage;
