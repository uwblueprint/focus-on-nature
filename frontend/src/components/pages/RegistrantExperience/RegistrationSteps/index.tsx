import { Box, Flex, useDisclosure, useToast } from "@chakra-ui/react";
import React, {
  useState,
  useReducer,
  Reducer,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
import {
  OptionalClause,
  RegistrantExperienceCamper,
  WaitlistedCamper,
} from "../../../../types/CamperTypes";
import { Waiver as WaiverType } from "../../../../types/AdminTypes";
import { saveRegistrationSessionToSessionStorage } from "../../../../utils/RegistrationUtils";
import {
  CheckoutData,
  EdlpChoice,
  EdlpSelections,
} from "../../../../types/RegistrationTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import RegistrationErrorModal from "../RegistrationResult/RegistrationErrorModal";
import { checkAdditionalQuestionsAnswered } from "./AdditionalInfo/additionalInfoReducer";
import { mapToCreateCamperDTO } from "../../../../utils/CampUtils";
import { EDLP_PLACEHOLDER_TIMESLOT } from "../../../../constants/RegistrationConstants";

type RegistrationStepsProps = {
  camp: CampResponse;
  orderedSelectedSessions: CampSession[];
  waiver: WaiverType;
  waitlistedCamper?: WaitlistedCamper;
  onClickBack: () => void;
  failedCheckoutData?: CheckoutData;
};

const RegistrationSteps = ({
  camp,
  orderedSelectedSessions: selectedSessions,
  waiver,
  onClickBack,
  waitlistedCamper,
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

  const [isEditing, setIsEditing] = useState(0);

  const [campers, setCampers] = useState<RegistrantExperienceCamper[]>([
    {
      firstName: "",
      lastName: "",
      age: NaN,
      refundStatus: "Paid",
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

  const defaultSelections: EdlpSelections = useMemo(() => {
    return selectedSessions.map((campSession) => {
      const placeholderValues: { [key: string]: EdlpChoice } = {};
      campSession.dates.forEach((date) => {
        placeholderValues[date] = {
          earlyDropoff: {
            timeSlot: EDLP_PLACEHOLDER_TIMESLOT,
            units: 0,
            cost: 0,
          },
          latePickup: {
            timeSlot: EDLP_PLACEHOLDER_TIMESLOT,
            units: 0,
            cost: 0,
          },
        };
      });

      return placeholderValues;
    });
  }, [selectedSessions]);

  const [edlpSelections, setEdlpSelections] = useState<EdlpSelections>(
    defaultSelections,
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
      edlpSelections,
      requireEarlyDropOffLatePickup,
      chargeId,
    });

    window.location.assign(checkoutSessionUrl);
  };

  const appendOptionalClausesToCampers = (
    newOptionalClauses: OptionalClauseResponse[],
  ) => {
    setCampers(
      (
        oldCampers: RegistrantExperienceCamper[],
      ): RegistrantExperienceCamper[] => {
        const newCampers: RegistrantExperienceCamper[] = JSON.parse(
          JSON.stringify(oldCampers),
        ); // Deep Copy

        for (let i = 0; i < campers.length; i += 1) {
          newCampers[i].formResponses = campers[i].formResponses;
        } // Copy the formResponses map

        // Map the OptionalClauseResponse[] to OptionalClause[]
        const newCamperOptionalClauses: OptionalClause[] = [];
        newOptionalClauses.forEach((optionalClause) => {
          newCamperOptionalClauses.push({
            clause: optionalClause.text,
            agreed: optionalClause.agreed ?? false,
          });
        });

        // Update all the campers' optionalClauses field
        /* eslint-disable-next-line */
        for (const camper of newCampers) {
          camper.optionalClauses = newCamperOptionalClauses;
        }
        return newCampers;
      },
    );
  };

  const registerCampers = async (
    newCampers: RegistrantExperienceCamper[],
    edlp: EdlpSelections,
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
        mapToCreateCamperDTO(newCampers, edlp, waiverInterface.optionalClauses),
        selectedSessions.map((cs) => cs.id),
      );

      setRegistrationLoading(false);
      goToCheckout(checkoutSessionUrl, campersResponse[0].chargeId);
    } catch (error: Error | unknown) {
      setRegistrationLoading(false);

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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (waitlistedCamper) {
      const curCampers = [...campers];
      curCampers[0].firstName = waitlistedCamper.firstName;
      curCampers[0].lastName = waitlistedCamper.lastName;
      curCampers[0].age = waitlistedCamper.age;
      curCampers[0].contacts[0].firstName = waitlistedCamper.contactFirstName;
      curCampers[0].contacts[0].lastName = waitlistedCamper.contactLastName;
      curCampers[0].contacts[0].email = waitlistedCamper.contactEmail;
      curCampers[0].contacts[0].phoneNumber = waitlistedCamper.contactNumber;
      setCampers(curCampers);
    }
  }, [waitlistedCamper]);

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
  const [isPaymentSummary, setIsPaymentSummary] = useState(false);

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
            isWaitlistRegistration={waitlistedCamper !== undefined}
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
            edlpSelections={edlpSelections}
            setEdlpSelections={setEdlpSelections}
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
            edlpSelections={edlpSelections}
            onPageVisited={() => setReviewRegistrationVisited(true)}
            setCampers={setCampers}
            isPaymentSummary={isPaymentSummary}
            hasEDLP={hasEarlyDropOffLatePickup}
            requireEDLP={requireEarlyDropOffLatePickup}
            setRequireEDLP={setRequireEarlyDropOffLatePickup}
            setEdlpSelections={setEdlpSelections}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        );
      default:
        throw new Error("unexpected page");
    }
  };

  const handleStepNavigation = (stepsToMove: number) => {
    const desiredStep = currentStep + stepsToMove;
    if (
      currentStep === RegistrantExperienceSteps.ReviewRegistrationPage &&
      !isPaymentSummary &&
      stepsToMove === 1
    ) {
      setIsPaymentSummary(true);
    } else if (
      currentStep === RegistrantExperienceSteps.ReviewRegistrationPage &&
      isPaymentSummary &&
      stepsToMove === -1
    ) {
      setIsPaymentSummary(false);
    } else if (RegistrantExperienceSteps[desiredStep]) {
      setCurrentStep(currentStep + stepsToMove);
      window.scrollTo(0, 0);
    } else if (desiredStep < 0) {
      onClickBack();
    } else {
      // Append the optional clauses to all the campers before registering the campers
      appendOptionalClausesToCampers(waiverInterface.optionalClauses);
      registerCampers(campers, edlpSelections);
    }
  };

  useEffect(() => {
    if (failedCheckoutData) {
      setCampers(failedCheckoutData.campers);
      setCheckoutUrl(failedCheckoutData.checkoutUrl);
      setCheckoutChargeId(failedCheckoutData.chargeId);
      setEdlpSelections(failedCheckoutData.edlpSelections);
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
      pt={{ sm: "120px", md: "120px", lg: "144px" }}
      pb={{ sm: "170px", md: "108px", lg: "144px" }}
      justifyContent="flex-start"
    >
      <RegistrationNavStepper
        currentStep={currentStep}
        isPersonalInfoFilled={isPersonalInfoFilled}
        isAdditionalInfoFilled={isAdditionalInfoFilled}
        isWaiverFilled={isWaiverFilled}
        isReviewRegistrationFilled={isPaymentSummary}
        setCurrentStep={setCurrentStep}
        isEditing={isEditing}
      />
      <Box mx="10vw">{getCurrentRegistrantStepComponent(currentStep)}</Box>
      <RegistrationFooter
        nextBtnRef={nextBtnRef}
        currentStep={currentStep}
        isCurrentStepCompleted={isCurrentStepCompleted(currentStep)}
        registrationLoading={registrationLoading}
        handleStepNavigation={handleStepNavigation}
        isPaymentSummary={isPaymentSummary}
        isWaitlistRegistration={waitlistedCamper !== undefined}
        isEditing={isEditing}
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
