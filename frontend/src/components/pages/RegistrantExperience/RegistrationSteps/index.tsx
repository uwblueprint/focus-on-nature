import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import React, { useState, useReducer, Reducer, useRef, useEffect } from "react";
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
import {
  mapToCampItems,
  saveCheckoutSessionToSessionStorage,
} from "../../../../utils/RegistrationUtils";
import { CheckoutData } from "../../../../types/RegistrationTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import RegistrationErrorModal from "../RegistrationResult/RegistrationErrorModal";

type RegistrationErrorModalMessage = {
  title: string;
  body: string;
};

type RegistrationStepsProps = {
  camp: CampResponse;
  selectedSessions: CampSession[];
  waiver: WaiverType;
  onClickBack: () => void;
  failedCheckoutData?: CheckoutData;
};

const RegistrationSteps = ({
  camp,
  selectedSessions,
  waiver,
  onClickBack,
  failedCheckoutData,
}: RegistrationStepsProps): React.ReactElement => {
  const {
    isOpen: errorModalIsOpen,
    onOpen: errorModalOnOpen,
    onClose: errorModalOnClose,
  } = useDisclosure();

  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );

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

  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);

  const [
    errorModalMessage,
    setErrorModalMessage,
  ] = useState<RegistrationErrorModalMessage>({
    title: "",
    body: "",
  });

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
  const [reviewRegistrationVisited, setReviewRegistrationVisited] = useState(
    false,
  );

  const goToCheckout = (
    checkoutSessionUrl: string,
    currentCamp: CampResponse,
  ) => {
    saveCheckoutSessionToSessionStorage(currentCamp.id, {
      campers,
      camp,
      items: mapToCampItems(currentCamp, campers),
      waiver: waiverInterface.waiver as WaiverType,
      checkoutUrl: checkoutSessionUrl,
      selectedSessionIds: new Set(
        selectedSessions.map((session) => session.id),
      ),
    });

    window.location.replace(checkoutSessionUrl);
  };

  const registerCampers = async (
    newCampers: RegistrantExperienceCamper[],
    currentCamp: CampResponse,
  ) => {
    try {
      const { checkoutSessionUrl } = await CamperAPIClient.registerCampers(
        newCampers,
      );

      goToCheckout(checkoutSessionUrl, currentCamp);
    } catch (error: unknown) {
      setErrorModalMessage({
        title: "Checkout failed",
        body: "Unable to create a checkout session. Please try again.",
      });
      errorModalOnOpen();
    }
  };

  const isPersonalInfoFilled = checkPersonalInfoFilled(campers, camp);
  const isAdditionalInfoFilled = sampleAdditionalInfo;
  const isWaiverFilled = waiverInterface.waiverCompleted;
  const isReviewRegistrationFilled = reviewRegistrationVisited;
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
            campSessions={selectedSessions}
            camp={camp}
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
            campName={camp.name}
          />
        );
      case RegistrantExperienceSteps.ReviewRegistrationPage:
        return (
          <ReviewRegistration
            campers={campers}
            camp={camp}
            onPageVisited={() => setReviewRegistrationVisited(true)}
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
      registerCampers(campers, camp);
    }
  };

  useEffect(() => {
    if (failedCheckoutData) {
      setCampers(failedCheckoutData.campers);
      setCheckoutUrl(failedCheckoutData.checkoutUrl);

      // TODO need the isFilled booleans to point to fields on campers
      // to fill out status bar properly
      setSampleAdditionalInfo(true);

      setCurrentStep(RegistrantExperienceSteps.ReviewRegistrationPage);
      setErrorModalMessage({
        title: "Payment cancelled",
        body:
          "No payment was processed. If this was not intentional, please try again.",
      });
      errorModalOnOpen();
    }
  }, [failedCheckoutData, errorModalOnOpen]);

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
      <RegistrationErrorModal
        title={errorModalMessage.title}
        message={errorModalMessage.body}
        onConfirm={() => {
          if (checkoutUrl && camp) {
            goToCheckout(checkoutUrl, camp);
          }
        }}
        isOpen={errorModalIsOpen}
        onClose={errorModalOnClose}
      />
    </Flex>
  );
};

export default RegistrationSteps;
