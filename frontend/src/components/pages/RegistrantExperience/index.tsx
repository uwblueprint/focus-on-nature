import React, { useEffect, useState } from "react";
import { Text, Spinner, Flex, useToast } from "@chakra-ui/react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CampResponse } from "../../../types/CampsTypes";
import { SUCCESS_RESULT_CODE } from "../../../constants/RegistrationConstants";
import { restoreRegistrationSessionFromSessionStorage } from "../../../utils/RegistrationUtils";
import { CheckoutData } from "../../../types/RegistrationTypes";
import RegistrationResultPage from "./RegistrationResult";
import RegistrationSteps from "./RegistrationSteps";
import SessionSelection from "./SessionSelection";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { WaitlistedCamper } from "../../../types/CamperTypes";
import { Waiver as WaiverType } from "../../../types/AdminTypes";
import { sortSessions } from "../../../utils/CampUtils";
import WaitlistExperiencePage from "../WaitlistExperience";

type InitialLoadingState = {
  waiver: boolean;
  camp: boolean;
};

const RegistrantExperiencePage = (): React.ReactElement => {
  const toast = useToast();
  const history = useHistory();

  const location = useLocation();
  const { id: campId } = useParams<{ id: string }>();
  const searchParams = new URLSearchParams(location.search);
  const waitlistedSessionId = searchParams.get("waitlistedSessionId");
  const waitlistedCamperId = searchParams.get("waitlistedCamperId");

  const params = new URLSearchParams(location.search);
  const registrationResult = params.get("result");

  const [camp, setCamp] = useState<CampResponse | undefined>(undefined);
  const [waiver, setWaiver] = useState<WaiverType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<InitialLoadingState>({
    waiver: true,
    camp: true,
  });

  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(
    new Set(),
  );
  const [currentStep, setCurrentStep] = useState<
    | "loading"
    | "selection"
    | "registration"
    | "waitlist"
    | "registrationResult"
    | "notFound"
  >("loading");

  const [waitlistedCamper, setWaitlistedCamper] = useState<WaitlistedCamper>();

  const [restoredRegistration, setRestoredRegistration] = useState<
    CheckoutData | undefined
  >(undefined);

  const getCurrentStep = () => {
    switch (currentStep) {
      case "loading":
        return (
          <Flex h="100vh" w="100vw" align="center" justify="center">
            <Spinner />
          </Flex>
        );

      case "selection":
        return (
          <SessionSelection
            camp={camp as CampResponse}
            selectedSessions={selectedSessions}
            setSelectedSessions={setSelectedSessions}
            onWaitListSubmission={() => setCurrentStep("waitlist")}
            onRegistrationSubmission={() => setCurrentStep("registration")}
          />
        );
      case "registration":
        return (
          <RegistrationSteps
            camp={camp as CampResponse}
            orderedSelectedSessions={sortSessions(
              (camp as CampResponse).campSessions.filter((session) =>
                selectedSessions.has(session.id),
              ),
            )}
            waiver={waiver as WaiverType}
            onClickBack={() => setCurrentStep("selection")}
            waitlistedCamper={waitlistedCamper}
            failedCheckoutData={restoredRegistration}
          />
        );
      case "waitlist":
        return (
          <WaitlistExperiencePage
            camp={camp as CampResponse}
            selectedCampSessions={(camp as CampResponse).campSessions.filter(
              (session) => selectedSessions.has(session.id),
            )}
            onClickBack={() => setCurrentStep("selection")}
          />
        );
      case "registrationResult": {
        const sessionsIds = new Set(restoredRegistration?.selectedSessionIds);

        return (
          <RegistrationResultPage
            camp={camp}
            campers={restoredRegistration?.campers}
            sessions={
              camp?.campSessions.filter((session) =>
                sessionsIds.has(session.id),
              ) ?? []
            }
            edlpSelections={restoredRegistration?.edlpSelections}
            chargeId={restoredRegistration?.chargeId}
          />
        );
      }
      default:
        // Includes "notFound".
        return (
          <Text mx="10vw">
            Error: Camp not found. Please go back and try again.
          </Text>
        );
    }
  };

  useEffect(() => {
    if (!isLoading.camp && !isLoading.waiver) {
      setCurrentStep(camp && waiver ? "selection" : "notFound");
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (registrationResult === SUCCESS_RESULT_CODE)
      setCurrentStep("registrationResult");
  }, [registrationResult]);

  useEffect(() => {
    // We could remove this conditional, if we want to handle the "navigate back" action
    let cachedRegistration: CheckoutData | undefined;
    if (registrationResult) {
      cachedRegistration = restoreRegistrationSessionFromSessionStorage();

      if (cachedRegistration) {
        // Some data is expected by the default camp registration flow, and is
        // passed through individual state variables. Data generated in the previous
        // session (eg. checkout URL) is passed via `restoredRegistration` field,
        // which is `undefined` if by default if no previous session exists.
        setRestoredRegistration(cachedRegistration);

        setCamp(cachedRegistration.camp);
        // Edge case here -- if they go to checkout, come back, and a session has completed
        // in that time, we will still let them register for it. This is necessary because
        // (1) selectedSessions is also the source of truth for the registration result page, where
        // we would expect all paid-for sessions to appear, and (2) we would otherwise have to
        // recognize this change and regenerate a new checkout link, and notify them of the change in
        // checkout items. Checkouts expire within a day (?) so it's a very limited case.
        setSelectedSessions(new Set(cachedRegistration.selectedSessionIds));
        setCurrentStep("registration");
        setCamp(cachedRegistration.camp);
        setWaiver(cachedRegistration.waiverInterface.waiver);
      }
    }

    // If we expect session cache to exist, and it doesn't exist, do not repopulate
    // via network call -- instead show generic message in RegistrationResult in case
    // the user entered `?result=success` manually into the URL (so no actual success)
    if (!cachedRegistration && registrationResult !== SUCCESS_RESULT_CODE) {
      CampsAPIClient.getCampById(campId)
        .then((campResponse) => {
          if (campResponse.id) {
            setCamp(campResponse);

            if (waitlistedSessionId && waitlistedCamperId) {
              // Ensure the given waitlisted session id is in the camp sessions of this camp
              const waitlistedCampSession = campResponse.campSessions.find(
                (cs) => cs.id === waitlistedSessionId,
              );
              if (!waitlistedCampSession) {
                throw new Error(
                  "Could not find requested session to register for in this camp",
                );
              }
              // Find the waitlisted camper id in the list of waitlisted campers in the given session
              const waitlistCamper = waitlistedCampSession.waitlist.find(
                (camper) => camper.id === waitlistedCamperId,
              );
              if (!waitlistCamper || !waitlistCamper.linkExpiry) {
                throw new Error(
                  "Could not find details of requested waitlisted camper for this camp session",
                );
              }

              // Ensure the invitation link has not expired
              if (new Date(waitlistCamper.linkExpiry) < new Date()) {
                throw new Error("The invitation link has expired");
              }
              setCurrentStep("registration");
              setWaitlistedCamper(waitlistCamper);
              setSelectedSessions(new Set([waitlistedSessionId]));
            }
          }
        })
        .catch((error) => {
          history.push(`/error`);
          toast({
            description: error.message,
            status: "error",
            variant: "subtle",
            duration: 3000,
          });
        })
        .finally(() =>
          setIsLoading((prevLoadingState) => {
            return { ...prevLoadingState, camp: false };
          }),
        );

      AdminAPIClient.getWaiver()
        .then((waiverResponse) =>
          waiverResponse.clauses ? setWaiver(waiverResponse) : null,
        )
        .finally(() =>
          setIsLoading((prevLoadingState) => {
            return {
              ...prevLoadingState,
              waiver: false,
            };
          }),
        );
    }
  }, [
    campId,
    waitlistedSessionId,
    waitlistedCamperId,
    toast,
    history,
    registrationResult,
  ]);
  return getCurrentStep();
};

export default RegistrantExperiencePage;
