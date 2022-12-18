import React, { Reducer, useEffect, useReducer, useRef, useState } from "react";

import { Box, Text } from "@chakra-ui/react";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { Camper, RegistrantExperienceCamper } from "../../../types/CamperTypes";
import { CampResponse, CampSession } from "../../../types/CampsTypes";
import {
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../types/waiverTypes";
import AdditionalInfo from "./AdditionalInfo";
import PersonalInfo from "./PersonalInfo";
import { checkPersonalInfoFilled } from "./PersonalInfo/personalInfoReducer";
import RegistrantExperienceSteps from "./RegistrationExperienceSteps";
import RegistrationFooter from "./RegistrationFooter";
import RegistrationNavStepper from "./RegistrationNavStepper";
import ReviewRegistration from "./ReviewRegistration";
import Waiver from "./Waiver";
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

  const [camp, setCamp] = useState<CampResponse>({} as CampResponse);

  React.useEffect(() => {
    const getCamp = async () => {
      const id = "63139c7bc3d7b55b44a01531";
      const campRes = await CampsAPIClient.getCampById(id);
      if (campRes) setCamp(campRes);
    };
    getCamp();
  }, []);

  const [personalInfo, setPersonalInfo] = useState([
    { firstName: "Joe", lastName: "Smith1" },
    { firstName: "Joe", lastName: "Smith2" },
    { firstName: "Joe", lastName: "Smith3" },
  ] as Camper[]);

  const [samplePersonalInfo, setSamplePersonalInfo] = useState(false);
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
  const nextBtnRef = useRef<HTMLButtonElement>(null);

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
            campSessions={campSessions}
            campName="Guelph Summer Camp 2022"
          />
        );
      case RegistrantExperienceSteps.AdditionalInfoPage:
        return (
          <Box>
            <Text textStyle="displayXLarge">{`${camp.name} Registration`}</Text>
            <AdditionalInfo
              isChecked={sampleAdditionalInfo}
              toggleChecked={() =>
                setSampleAdditionalInfo(!sampleAdditionalInfo)
              }
              formQuestions={camp.formQuestions}
              personalInfo={personalInfo}
            />
          </Box>
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
  console.log(camp);

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
        nextBtnRef={nextBtnRef}
        currentStep={currentStep}
        isCurrentStepCompleted={isCurrentStepCompleted(currentStep)}
        handleStepNavigation={handleStepNavigation}
      />
    </Box>
  );
};

export default RegistrantExperiencePage;
