import { Box, Flex } from "@chakra-ui/react";
import React, { useState, useReducer, Reducer, useRef } from "react";
import { CampResponse, CampSession } from "../../../../types/CampsTypes";
import {
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../../types/waiverTypes";
import RegistrationFooter from "./RegistrationFooter";
import RegistrationNavStepper from "./RegistrationNavStepper";
import AdditionalInfo from "./AdditionalInfo";
import PersonalInfo from "./PersonalInfo";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";
import ReviewRegistration from "./ReviewRegistration";
import Waiver from "./Waiver";
import waiverReducer from "./Waiver/WaiverReducer";
import { checkPersonalInfoFilled } from "./PersonalInfo/personalInfoReducer";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { Waiver as WaiverType } from "../../../../types/AdminTypes";

type RegistrationStepsProps = {
  camp: CampResponse;
  selectedSessions: CampSession[];
  waiver: WaiverType;
  onClickBack: () => void;
};

const RegistrationSteps = ({
  camp,
  selectedSessions,
  waiver,
  onClickBack,
}: RegistrationStepsProps): React.ReactElement => {
  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );
  const [waiverInterface, waiverDispatch] = useReducer<
    Reducer<WaiverInterface, WaiverReducerDispatch>
  >(waiverReducer, {
    campName: camp.name,
    waiver,
    optionalClauses: [],
    requiredClauses: [],
    agreedRequiredClauses: false,
    loadingWaiver: true,
    date: "",
    name: "",
    waiverCompleted: false,
  });

  const [sampleAdditionalInfo, setSampleAdditionalInfo] = useState(false);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);
  const [campers, setCampers] = useState<RegistrantExperienceCamper[]>([
    {
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
      optionalClauses: [],
    },
  ]);
  const isPersonalInfoFilled = checkPersonalInfoFilled(campers, camp);
  const isAdditionalInfoFilled = sampleAdditionalInfo;
  const isWaiverFilled = waiverInterface.waiverCompleted;
  const isReviewRegistrationFilled = sampleRegisterField;
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const [
    requireEarlyDropOffLatePickup,
    setRequireEarlyDropOffLatePickup,
  ] = useState<boolean | null>(null);

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
            nextBtnRef={nextBtnRef}
            campers={campers}
            setCampers={setCampers}
            campSessions={selectedSessions}
            camp={camp}
          />
        );
      case RegistrantExperienceSteps.AdditionalInfoPage:
        return (
          <AdditionalInfo
            toggleChecked={setSampleAdditionalInfo}
            formQuestions={camp.formQuestions}
            campers={campers}
            setCampers={setCampers}
            campName={camp?.name || ""}
            hasEarlyDropOffLatePickup={
              camp.earlyDropoff !== undefined && camp.latePickup !== undefined
            }
            requireEarlyDropOffLatePickup={requireEarlyDropOffLatePickup}
            setRequireEarlyDropOffLatePickup={setRequireEarlyDropOffLatePickup}
            nextBtnRef={nextBtnRef}
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
      onClickBack();
    } else {
      alert("PLACEHOLDER - go to payment");
    }
  };

  console.log("campers", campers);

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
      <Box mx="10vw">{getCurrentRegistrantStepComponent(currentStep)}</Box>
      <RegistrationFooter
        nextBtnRef={nextBtnRef}
        currentStep={currentStep}
        isCurrentStepCompleted={isCurrentStepCompleted(currentStep)}
        handleStepNavigation={handleStepNavigation}
      />
    </Flex>
  );
};

export default RegistrationSteps;
