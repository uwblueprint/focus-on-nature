import { useParams } from "react-router-dom";
import React, { useEffect, useState, useReducer, Reducer, useRef } from "react";

import { Box, Text, Spinner, Flex, useDisclosure } from "@chakra-ui/react";
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
import { CampResponse, CampSession } from "../../../types/CampsTypes";
import { checkPersonalInfoFilled } from "./PersonalInfo/personalInfoReducer";
import { RegistrantExperienceCamper } from "../../../types/CamperTypes";
import { CreateCamperRequest } from "../../../types/CamperTypes";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";
import RegistrationErrorModal from "./RegistrationResult/RegistrationErrorModal";

export const CAMP_ID_SESSION_STORAGE_KEY = "checkoutSessionCampId";

const dummyCampers: CreateCamperRequest[] = [
  {
    campSession: "63139cdec3d7b55b44a01541",
    firstName: "test",
    lastName: "test",
    age: 12,
    allergies: "",
    earlyDropoff: [new Date("2022-04-06T00:00:00.000+00:00")],
    latePickup: [new Date("2022-04-06T00:00:00.000+00:00")],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mommy",
        lastName: "?",
        email: "mommyyy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "mommy",
      },
      {
        firstName: "Daddy",
        lastName: "?",
        email: "daddy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "daddy",
      },
    ],
    registrationDate: new Date("2022-04-06T00:00:00.000+00:00"),
    hasPaid: false,
    // formResponses: "622cfedaaf70bf090031d064","five",
    chargeId: "hi",
    charges: {
      camp: 20,
      earlyDropoff: 0,
      latePickup: 0,
    },
    optionalClauses: [
      {
        clause: "",
        agreed: true,
      },
    ],
  },
  {
    campSession: "63139cdec3d7b55b44a01541",
    firstName: "test2",
    lastName: "test2",
    age: 12,
    allergies: "",
    // earlyDropoff: [new Date("2022-04-06T00:00:00.000+00:00")],
    earlyDropoff: [],
    latePickup: [new Date("2022-04-06T00:00:00.000+00:00")],
    // latePickup: [],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mommy",
        lastName: "?",
        email: "mommyyy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "mommy",
      },
      {
        firstName: "Daddy",
        lastName: "?",
        email: "daddy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "daddy",
      },
    ],
    registrationDate: new Date("2022-04-06T00:00:00.000+00:00"),
    hasPaid: false,
    // formResponses: "622cfedaaf70bf090031d064","five",
    chargeId: "hi",
    charges: {
      camp: 20,
      earlyDropoff: 0,
      latePickup: 0,
    },
    optionalClauses: [
      {
        clause: "",
        agreed: true,
      },
    ],
  },
];

export const getCheckoutSessionStorageKey = (campId: string): string =>
  `checkout-${campId}`;
export const getFailedSessionStorageKey = (campId: string): string =>
  `failedCheckout-${campId}`;

const RegistrantExperiencePage = (): React.ReactElement => {
  const { id: campId } = useParams<{ id: string }>();

  const {
    isOpen: errorModalIsOpen,
    onOpen: errorModalOnOpen,
    onClose: errorModalOnClose,
  } = useDisclosure();

  const [camp, setCamp] = useState<CampResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);
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

  const [sampleAdditionalInfo, setSampleAdditionalInfo] = useState(false);
  const [sampleRegisterField, setSampleRegisterField] = useState(false);
  // TODO: Get campSessions from previous registration step (Currently using dummy value)
  const campSessions: CampSession[] = [
    {
      id: "123456",
      camp: camp ? camp.name : "",
      capacity: 3,
      campers: [],
      waitlist: [],
      dates: [],
    },
    {
      id: "654321",
      camp: camp ? camp.name : "",
      capacity: 2,
      campers: [],
      waitlist: [],
      dates: [],
    },
  ];
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

  const [registeringCampers, setRegisteringCampers] = useState<
    CreateCamperRequest[]
  >(dummyCampers);

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

  const registerCampers = async (campers: CreateCamperRequest[]) => {
    const { checkoutSessionUrl } = await CamperAPIClient.registerCampers(
      campers,
    );

    if (checkoutSessionUrl) {
      setCheckoutUrl(checkoutSessionUrl);
    } else {
      errorModalOnOpen();
    }
  };

  const getCurrentRegistrantStepComponent = (
    step: RegistrantExperienceSteps,
  ) => {
    switch (step) {
      case RegistrantExperienceSteps.PersonalInfoPage:
        return camp ? (
          <PersonalInfo
            nextBtnRef={nextBtnRef}
            campers={campers}
            setCampers={setCampers}
            campSessions={campSessions}
            camp={camp}
          />
        ) : (
          <Spinner />
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
      registerCampers(registeringCampers);
    }
  };

  useEffect(() => {
    // check if restore session key, if so restore session and reset key to inprogress
    const failedSession = sessionStorage.getItem(
      getFailedSessionStorageKey(campId),
    );

    if (failedSession) {
      // restore state -- need the isFilled booleans to point to fields
      // TODO need to navigate to page 4
      setRegisteringCampers(JSON.parse(failedSession));
    }
    sessionStorage.clear();

    CampsAPIClient.getCampById(campId).then((campResponse) => {
      if (campResponse.id) {
        setCamp(campResponse);
      }
      setIsLoading(false);
    });

    AdminAPIClient.getWaiver().then((waiver) => {
      if (waiver.clauses) {
        waiverDispatch({
          type: WaiverActions.LOADED_WAIVER,
          waiver,
        });
      }

      // TODO error handling
    });
  }, [campId]);

  if (checkoutUrl) {
    const camperCache = JSON.stringify(registeringCampers);
    sessionStorage.setItem(CAMP_ID_SESSION_STORAGE_KEY, campId);
    sessionStorage.setItem(getCheckoutSessionStorageKey(campId), camperCache);

    // `assign()` pushes external link to history
    window.location.assign(checkoutUrl);
  }

  return (
    <Flex
      direction="column"
      w="100vw"
      pt={{ sm: "120px", md: "120px", lg: "144px" }}
      pb={{ sm: "170px", md: "108px", lg: "144px" }}
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
        nextBtnRef={nextBtnRef}
        currentStep={currentStep}
        isCurrentStepCompleted={isCurrentStepCompleted(currentStep)}
        handleStepNavigation={handleStepNavigation}
      />
      <RegistrationErrorModal
        title="Payment Failed"
        message="Your payment has not gone through. Please try again!"
        isOpen={errorModalIsOpen}
        onClose={errorModalOnClose}
        onConfirm={() => alert("implement")}
      />
    </Flex>
  );
};

export default RegistrantExperiencePage;
