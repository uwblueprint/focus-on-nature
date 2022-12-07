import React, { useEffect, useState, useReducer, Reducer } from "react";
import Params, { useParams} from "react-router-dom";

import { Box } from "@chakra-ui/react";
import PersonalInfo from "./PersonalInfo";
import AdditionalInfo from "./AdditionalInfo";
import Waiver from "./Waiver";
import ReviewRegistration from "./ReviewRegistration";
import RegistrationNavStepper from "./RegistrationNavStepper";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";
import RegistrationFooter from "./RegistrationFooter";
import { CampResponse } from "../../../types/CampsTypes";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
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

  const [camp, setCamp] = React.useState<CampResponse>();
  console.log(camp)

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const getCamps = async () => {
      const res = await CampsAPIClient.getCampById(id);
      if (res) {
        setCamp(res);
      }
    };

    getCamps();
  }, []);

  const [samplePersonalInfo, setSamplePersonalInfo] = useState(false);
  const [edlpChoices, setEdlpChoices] = useState<Record<string, unknown>>({});
  console.log(edlpChoices)
  const [edlpFees, setEdlpFees] = useState(0);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);

  const isPersonalInfoFilled = samplePersonalInfo;
  const isAdditionalInfoFilled = true;
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
            camp={camp}
            edlpChoices={edlpChoices}
            edlpFees={edlpFees}
            setEdlpChoices={setEdlpChoices}
            setEdlpFees={setEdlpFees}

            // toggleChecked={() => setSampleAdditionalInfo(!sampleAdditionalInfo)}
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
      <RegistrationFooter
        currentStep={currentStep}
        isCurrentStepCompleted={isCurrentStepCompleted(currentStep)}
        handleStepNavigation={handleStepNavigation}
      />
    </Box>
  );
};

export default RegistrantExperiencePage;
