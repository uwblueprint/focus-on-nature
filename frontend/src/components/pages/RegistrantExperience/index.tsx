import { useLocation, useParams } from "react-router-dom";
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
import { CreateCamperRequest } from "../../../types/CamperTypes";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";
import RegistrationErrorModal from "./RegistrationResult/RegistrationErrorModal";
import {
  CAMP_ID_SESSION_STORAGE_KEY,
  CANCEL_RESULT_CODE,
  SUCCESS_RESULT_CODE,
} from "../../../constants/RegistrationConstants";
import {
  getCheckoutSessionStorageKey,
  mapToCampItems,
} from "../../../utils/RegistrationUtils";
import { CheckoutData } from "../../../types/RegistrationTypes";
import { Waiver as WaiverType } from "../../../types/AdminTypes";
import RegistrationResultPage from "./RegistrationResult";

type ErrorModalMessage = {
  title: string;
  body: string;
};

const RegistrantExperiencePage = (): React.ReactElement => {
  const { id: campId } = useParams<{ id: string }>();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const registrationResult = params.get("result");

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
  const [campers, setCampers] = useState<CreateCamperRequest[]>([
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

  const [reviewRegistrationVisited, setReviewRegistrationVisited] = useState(
    false,
  );

  if (
    !reviewRegistrationVisited &&
    currentStep === RegistrantExperienceSteps.ReviewRegistrationPage
  ) {
    setReviewRegistrationVisited(true);
  }
  const isReviewRegistrationFilled = reviewRegistrationVisited;
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const [errorModalMessage, setErrorModalMessage] = useState<ErrorModalMessage>(
    {
      title: "",
      body: "",
    },
  );

  const saveSessionToSessionStorage = (
    sessionCampId: string, // better named `campId`, but linter doesn't like
    checkoutData: CheckoutData,
  ) => {
    sessionStorage.setItem(CAMP_ID_SESSION_STORAGE_KEY, sessionCampId);
    sessionStorage.setItem(
      getCheckoutSessionStorageKey(sessionCampId),
      JSON.stringify(checkoutData),
    );
  };

  const goToCheckout = (
    checkoutSessionUrl: string,
    currentCamp: CampResponse,
  ) => {
    saveSessionToSessionStorage(campId, {
      campers,
      camp,
      items: mapToCampItems(currentCamp, campers),
      waiver: waiverInterface.waiver as WaiverType,
      checkoutUrl: checkoutSessionUrl,
    });

    // `assign()` pushes external link to history
    window.location.assign(checkoutSessionUrl);
  };

  const registerCampers = async (
    newCampers: CreateCamperRequest[],
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

  const getCurrentRegistrantStepComponent = (
    step: RegistrantExperienceSteps,
  ): React.ReactElement => {
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
        if (camp) {
          return <ReviewRegistration campers={campers} camp={camp} />;
        }
        return <></>;
      default:
        throw new Error("unexpected page");
    }
  };

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

  const handleStepNavigation = (stepsToMove: number) => {
    const desiredStep = currentStep + stepsToMove;
    if (RegistrantExperienceSteps[desiredStep]) {
      setCurrentStep(currentStep + stepsToMove);
    } else if (desiredStep < 0) {
      alert("PLACEHOLDER - go to initial registration");
    } else if (camp) {
      registerCampers(campers, camp);
    } else {
      alert("Unexpected camp state. Please restart registration.");
    }
  };

  useEffect(() => {
    const checkoutCampId = sessionStorage.getItem(CAMP_ID_SESSION_STORAGE_KEY);

    let sessionWasRestored = false;

    if (checkoutCampId && registrationResult) {
      const checkoutKey = getCheckoutSessionStorageKey(checkoutCampId);
      const sessionData = sessionStorage.getItem(checkoutKey);
      sessionStorage.clear();

      if (sessionData) {
        try {
          const restoredSession = JSON.parse(sessionData) as CheckoutData;

          setCampers(restoredSession.campers);
          setCamp(restoredSession.camp);
          waiverDispatch({
            type: WaiverActions.LOADED_WAIVER,
            waiver: restoredSession.waiver,
          });
          setCheckoutUrl(restoredSession.checkoutUrl);

          if (registrationResult === CANCEL_RESULT_CODE) {
            // TODO need the isFilled booleans to point to fields on campers
            // to fill out status bar properly
            setSampleAdditionalInfo(true);
            setIsLoading(false);
            setCurrentStep(RegistrantExperienceSteps.ReviewRegistrationPage);

            setErrorModalMessage({
              title: "Payment cancelled",
              body:
                "No payment was processed. If this was not intentional, please try again.",
            });
            errorModalOnOpen();
          }

          sessionWasRestored = true;
        } catch (err: unknown) {
          // eslint-disable-line no-empty
        }
      }
    }

    // If we expect session cache to exist, and it doesn't exist, do not repopulate
    // via network call -- instead show generic message in RegistrationResult in case
    // the user entered `?result=success` manually into the URL (so no actually success)
    if (!sessionWasRestored && registrationResult !== SUCCESS_RESULT_CODE) {
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
    }
  }, [campId, errorModalOnOpen, registrationResult]);

  return (
    <>
      {registrationResult === SUCCESS_RESULT_CODE ? (
        <RegistrationResultPage
          camp={camp}
          campers={campers}
          items={camp ? mapToCampItems(camp, campers) : undefined}
        />
      ) : (
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
                <Text>
                  Error: Camp not found. Please go back and try again.
                </Text>
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
      )}
    </>
  );
};

export default RegistrantExperiencePage;
