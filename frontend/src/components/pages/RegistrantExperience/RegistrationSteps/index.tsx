import { Box, Flex, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useState, useReducer, Reducer, useRef, useEffect } from "react";
import { CampResponse, CampSession } from "../../../../types/CampsTypes";
import {
  OptionalClauseResponse,
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../../types/waiverRegistrationTypes";
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
import { saveRegistrationSessionToSessionStorage } from "../../../../utils/RegistrationUtils";
import { CheckoutData, EdlpChoice } from "../../../../types/RegistrationTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import RegistrationErrorModal from "../RegistrationResult/RegistrationErrorModal";
import { checkAdditionalQuestionsAnswered } from "./AdditionalInfo/additionalInfoReducer";
import { mapToCreateCamperDTO } from "../../../../utils/CampUtils";

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
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState<RegistrantExperienceSteps>(
    RegistrantExperienceSteps.PersonalInfoPage,
  );

  const [campers, setCampers] = useState<RegistrantExperienceCamper[]>([
    {
      firstName: "",
      lastName: "",
      age: NaN,
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
      optionalClauses: [],
    },
  ]);

  const [
    requireEarlyDropOffLatePickup,
    setRequireEarlyDropOffLatePickup,
  ] = useState<boolean | null>(null);

  // Each camp session has an array of EdlpChoice objects
  // Each EdlpChoice object looks like {date: "date of a day of camp", edlp: ["8:30", "16:00"], edlpCost: [40, 20]}
  const [edlpChoices, setEdlpChoices] = useState<EdlpChoice[][]>(
    selectedSessions.map((campSession) => {
      return campSession.dates.map((date) => {
        return {
          date,
          earlyDropoff: { timeSlot: "-", units: 0, cost: 0 },
          latePickup: { timeSlot: "-", units: 0, cost: 0 },
        };
      });
    }),
  );

  const [waiverInterface, waiverDispatch] = useReducer<
    Reducer<WaiverInterface, WaiverReducerDispatch>
  >(waiverReducer, {
    campName: camp.name,
    waiver,
    optionalClauses: waiver.clauses.reduce(
      (optionalClauses: OptionalClauseResponse[], clause) => {
        if (!clause.required) {
          optionalClauses.push({
            ...clause,
            agreed: undefined,
          });
        }

        return optionalClauses;
      },
      [],
    ),
    requiredClauses: waiver.clauses.filter((clause) => clause.required),
    agreedRequiredClauses: false,
    date: "",
    name: "",
    waiverCompleted: false,
  });

  const [reviewRegistrationVisited, setReviewRegistrationVisited] = useState(
    false,
  );

  const [registrationLoading, setRegistrationLoading] = useState(false);

  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);
  const [checkoutChargeId, setCheckoutChargeId] = useState<string | undefined>(
    undefined,
  );

  const goToCheckout = (checkoutSessionUrl: string, chargeId: string) => {
    saveRegistrationSessionToSessionStorage(camp.id, {
      campers,
      camp,
      waiverInterface,
      checkoutUrl: checkoutSessionUrl,
      selectedSessionIds: selectedSessions.map((session) => session.id),
      edlpChoices,
      requireEarlyDropOffLatePickup,
      chargeId,
    });

    window.location.assign(checkoutSessionUrl);
  };

  const registerCampers = async (
    newCampers: RegistrantExperienceCamper[],
    edlp: EdlpChoice[][],
  ) => {
    try {
      if (newCampers.length === 0) {
        throw new Error("Registration must have at least one camper");
      }

      setRegistrationLoading(true);
      const {
        checkoutSessionUrl,
        campers: campersResponse,
      } = await CamperAPIClient.registerCampers(
        mapToCreateCamperDTO(newCampers, edlp),
        selectedSessions.map((cs) => cs.id),
      );

      setRegistrationLoading(false);
      goToCheckout(checkoutSessionUrl, campersResponse[0].chargeId);
    } catch (error: Error | unknown) {
      let errorMessage =
        "Unable to create a checkout session. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Checkout failed.",
        description: errorMessage,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  const hasEarlyDropOffLatePickup =
    camp.earlyDropoff !== undefined &&
    camp.earlyDropoff !== "" &&
    camp.latePickup !== undefined &&
    camp.latePickup !== "";

  const isPersonalInfoFilled = checkPersonalInfoFilled(campers, camp);
  const isAdditionalInfoFilled = checkAdditionalQuestionsAnswered(
    campers,
    camp.formQuestions.filter(
      (question) => question.category === "CampSpecific",
    ),
    hasEarlyDropOffLatePickup,
    requireEarlyDropOffLatePickup,
  );
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
            selectedSessions={selectedSessions}
            nextBtnRef={nextBtnRef}
            campers={campers}
            setCampers={setCampers}
            camp={camp}
            hasEDLP={hasEarlyDropOffLatePickup}
            requireEDLP={requireEarlyDropOffLatePickup}
            setRequireEDLP={setRequireEarlyDropOffLatePickup}
            edlpChoices={edlpChoices}
            setEdlpChoices={setEdlpChoices}
          />
        );
      case RegistrantExperienceSteps.WaiverPage:
        return (
          <Waiver
            nextBtnRef={nextBtnRef}
            waiverInterface={waiverInterface}
            waiverDispatch={waiverDispatch}
            campName={camp.name}
          />
        );
      case RegistrantExperienceSteps.ReviewRegistrationPage:
        return (
          <ReviewRegistration
            campers={campers}
            sessions={selectedSessions}
            camp={camp}
            edlpChoices={edlpChoices}
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
      window.scrollTo(0, 0);
    } else if (desiredStep < 0) {
      onClickBack();
    } else {
      registerCampers(campers, edlpChoices);
    }
  };

  useEffect(() => {
    if (failedCheckoutData) {
      setCampers(failedCheckoutData.campers);
      setCheckoutUrl(failedCheckoutData.checkoutUrl);
      setCheckoutChargeId(failedCheckoutData.chargeId);
      setEdlpChoices(failedCheckoutData.edlpChoices);
      waiverDispatch({
        type: WaiverActions.SET_WAIVER_INTERFACE,
        waiver: failedCheckoutData.waiverInterface,
      });

      // There is a soft (front-end flow) check that this value is not null, as they
      // cannot pass to the checkout page that would produce `failedCheckoutData` without
      // assigning a non-null value, however this is not enforced in types so it is technically
      // possible to go to the final step with a null value.
      setRequireEarlyDropOffLatePickup(
        failedCheckoutData.requireEarlyDropOffLatePickup,
      );

      setCurrentStep(RegistrantExperienceSteps.ReviewRegistrationPage);
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
        registrationLoading={registrationLoading}
        handleStepNavigation={handleStepNavigation}
      />
      <RegistrationErrorModal
        onConfirm={() => {
          if (checkoutUrl && checkoutChargeId) {
            goToCheckout(checkoutUrl, checkoutChargeId);
          }
        }}
        isOpen={errorModalIsOpen}
        onClose={errorModalOnClose}
      />
    </Flex>
  );
};

export default RegistrationSteps;
