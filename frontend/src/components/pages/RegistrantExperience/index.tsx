import React, { useEffect, useState, useReducer, Reducer } from "react";

import { Box } from "@chakra-ui/react";
import PersonalInfo from "./PersonalInfo";
import AdditionalInfo from "./AdditionalInfo";
import Waiver from "./Waiver";
import ReviewRegistration from "./ReviewRegistration";
import RegistrationNavStepper from "./RegistrationNavStepper";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import {
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../types/waiverTypes";
import waiverReducer from "./Waiver/WaiverReducer";

const RegistrantExperiencePage = (): React.ReactElement => {
  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );
  const [waiverInterface, waiverDispatch] = useReducer<
    Reducer<WaiverInterface, WaiverReducerDispatch>
  >(waiverReducer, {
    // TODO: Add support to Waiver and WaiverReducer to get the actual name of the camp being accesses.
    campName: "Guelph Summer Camp 2022",
    waiver: undefined,
    optionalClauses: [],
    requiredClauses: [],
    agreedRequiredClauses: false,
    loadingWaiver: true,
    wroteDate: false,
    wroteName: false,
    waiverCompleted: false,
  });
  useEffect(() => {
    AdminAPIClient.getWaiver().then((waiver) => {
      waiverDispatch({
        type: WaiverActions.LOADED_WAIVER,
        waiver,
      });
    });
  }, []);

  const [samplePersonalInfo, setSamplePersonalInfo] = useState(false);
  const [sampleAdditionalInfo, setSampleAdditionalInfo] = useState(false);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);

  const isPersonalInfoFilled = samplePersonalInfo;
  const isAdditionalInfoFilled = sampleAdditionalInfo;
  const isWaiverFilled = waiverInterface.waiverCompleted;
  const isReviewRegistrationFilled = sampleRegisterField;

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
          />
        );
      case RegistrantExperienceSteps.ReviewRegistrationPage:
        return (
          <ReviewRegistration
            isChecked={sampleRegisterField}
            toggleChecked={() => setSampleRegisterField(!sampleRegisterField)}
          />
        );
      default:
        throw new Error("unexpected page");
    }
  };
  console.log(
    waiverInterface
  );
  return (
    <Box>
      <RegistrationNavStepper
        currentStep={currentStep}
        isPersonalInfoFilled={isPersonalInfoFilled}
        isAdditionalInfoFilled={isAdditionalInfoFilled}
        isWaiverFilled={isWaiverFilled}
        isReviewRegistrationFilled={isReviewRegistrationFilled}
        setCurrentStep={setCurrentStep}
      />

      <Box my="50px" mx="10vw">
        {getCurrentRegistrantStepComponent(currentStep)}
      </Box>
    </Box>
  );
};

export default RegistrantExperiencePage;
