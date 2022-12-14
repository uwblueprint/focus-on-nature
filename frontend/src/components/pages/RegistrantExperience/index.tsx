import React, { useEffect, useState, useReducer, Reducer } from "react";

import { Box } from "@chakra-ui/react";
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
import { checkPersonalInfoFilled } from "./PersonalInfo/personalInfoReducer";
import { RegistrantExperienceCamper } from "../../../types/CamperTypes";
import { CampSession } from "../../../types/CampsTypes";

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

  const [sampleAdditionalInfo, setSampleAdditionalInfo] = useState(false);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);
  // TODO: Get campSessions from previous registration step (Currently using dummy value)
  const campSessions: CampSession[] = [
    {
      id: "123456",
      camp: "Guelph Summer Camp 2022",
      capacity: 3,
      campers: [],
      waitlist: [],
      dates: [],
    },
    {
      id: "654321",
      camp: "Guelph Summer Camp 2022",
      capacity: 2,
      campers: [],
      waitlist: [],
      dates: [],
    },
  ];
  const [campers, setCampers] = useState<RegistrantExperienceCamper[]>([
    {
      id: "",
      campSessions: [campSessions[0].id, campSessions[1].id], // TODO: Edit this field when we get camp session data from previous step
      firstName: "",
      lastName: "",
      age: NaN,
      registrationDate: new Date(),
      hasPaid: false,
      contacts: [
        {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          relationshipToCamper: "",
        },
        {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          relationshipToCamper: "",
        },
      ],
      chargeId: "",
      charges: {
        camp: NaN,
        earlyDropoff: NaN,
        latePickup: NaN,
      },
      optionalClauses: [],
    },
  ]);
  const isPersonalInfoFilled = checkPersonalInfoFilled(campers);
  const isAdditionalInfoFilled = sampleAdditionalInfo;
  const isWaiverFilled = waiverInterface.waiverCompleted;
  const isReviewRegistrationFilled = sampleRegisterField;
  console.log(campers);
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
            campers={campers}
            setCampers={setCampers}
            campSessions={campSessions}
            campName="Guelph Summer Camp 2022"
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
