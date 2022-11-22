import React, { useEffect, useState, useReducer, Reducer } from "react";

import { Box } from "@chakra-ui/react";
import PersonalInfo from "./PersonalInfo";
import AdditionalInfo from "./AdditionalInfo";
import Waiver from "./Waiver";
import ReviewRegistration from "./ReviewRegistration";
import RegistrationNavStepper from "./RegistrationNavStepper";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { WaiverClause } from "../../../types/AdminTypes";
import {
  OptionalClauseResponse,
  RequiredClauseResponse,
  WaiverActions,
  WaiverInterface,
} from "./Waiver/waiverTypes";

enum RegistrantExperienceSteps {
  PersonalInfoPage,
  AdditionalInfoPage,
  WaiverPage,
  ReviewRegistrationPage,
}

const waiverReducer = (waiverInterface: WaiverInterface, action: any) => {
  switch (action.type) {
    case WaiverActions.LOADED_WAIVER: {
      const optionalClauses: OptionalClauseResponse[] = [];
      const requiredClauses: RequiredClauseResponse[] = [];
      const { waiver } = action.payload;

      waiver.clauses.forEach((clause: WaiverClause) => {
        if (clause.required) optionalClauses.push({ ...clause, agreed: false });
        else requiredClauses.push(clause);
      });
      return {
        ...waiverInterface,
        optionalClauses,
        requiredClauses,
        waiver,
        agreedRequiredClauses: false,
        loadingWaiver: false,
      };
    }
    case WaiverActions.ClICK_REQUIRED_CLAUSE:
      return {
        ...waiverInterface,
        agreedRequiredClauses: !waiverInterface.agreedRequiredClauses,
      };

    case WaiverActions.CLICK_OPTIONAL_CLAUSE: {
      if (!waiverInterface.optionalClauses) return waiverInterface;
      const changedClause: OptionalClauseResponse = action.payload;

      const newOptionalClauses:
        | OptionalClauseResponse[]
        | undefined = waiverInterface.optionalClauses?.map(
        (optionalClause: OptionalClauseResponse): OptionalClauseResponse => {
          if (optionalClause.text === changedClause.text) {
            return { ...optionalClause, agreed: !optionalClause.agreed };
          }
          return optionalClause;
        },
      );
      return {
        ...waiverInterface,
        optionalClauses: newOptionalClauses,
      };
    }
    default:
      return waiverInterface;
  }
};

const RegistrantExperiencePage = (): React.ReactElement => {
  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );
  const [waiverInterface, waiverDispatch] = useReducer<
    Reducer<WaiverInterface, any>
  >(waiverReducer, {
    // NOTE!?: issues with reducer code
    waiver: undefined,
    optionalClauses: [],
    requiredClauses: [],
    agreedRequiredClauses: false,
    loadingWaiver: true,
  });
  useEffect(() => {
    AdminAPIClient.getWaiver().then((waiver) => {
      waiverDispatch({
        type: WaiverActions.LOADED_WAIVER,
        payload: { waiver },
      });
    });
  }, []);

  const [samplePersonalInfo, setSamplePersonalInfo] = useState(false);
  const [sampleAdditionalInfo, setSampleAdditionalInfo] = useState(false);
  const [sampleWaiverField, setSampleWaiverField] = useState(false);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);

  const isPersonalInfoFilled = samplePersonalInfo;
  const isAdditionalInfoFilled = sampleAdditionalInfo;
  const isWaiverFilled = sampleWaiverField;
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
