import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { Text, Spinner, Flex } from "@chakra-ui/react";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CampResponse } from "../../../types/CampsTypes";
import {
  CAMP_ID_SESSION_STORAGE_KEY,
  SUCCESS_RESULT_CODE,
} from "../../../constants/RegistrationConstants";
import {
  getCheckoutSessionStorageKey,
  mapToCampItems,
} from "../../../utils/RegistrationUtils";
import { CheckoutData } from "../../../types/RegistrationTypes";
import RegistrationResultPage from "./RegistrationResult";
import RegistrationSteps from "./RegistrationSteps";
import SessionSelection from "./SessionSelection";
import { Waiver as WaiverType } from "../../../types/AdminTypes";

type InitialLoadingState = {
  waiver: boolean;
  camp: boolean;
};

const RegistrantExperiencePage = (): React.ReactElement => {
  const { id: campId } = useParams<{ id: string }>();

  const location = useLocation();
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
  const [sessionSelectionIsComplete, setSessionSelectionIsComplete] = useState(
    false,
  );

  const [restoredRegistration, setRestoredRegistration] = useState<
    CheckoutData | undefined
  >(undefined);

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
          if (restoredSession.camp) {
            // Some data is expected by the default camp registration flow, and is
            // passed through individual state variables. Data generated in the previous
            // session (eg. checkout URL) is passed via `restoredRegistration` field,
            // which is `undefined` if by default if no previous sessions exists.
            setRestoredRegistration(restoredSession);

            setSelectedSessions(restoredSession.selectedSessionIds);
            setSessionSelectionIsComplete(true);
            setCamp(restoredSession.camp);
            setWaiver(restoredSession.waiver);
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
    if (!sessionWasRestored && !registrationResult) {
      CampsAPIClient.getCampById(campId)
        .then((campResponse) =>
          campResponse.id ? setCamp(campResponse) : null,
        )
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
  }, [campId, registrationResult]);

  if (registrationResult === SUCCESS_RESULT_CODE) {
    return (
      <RegistrationResultPage
        camp={camp}
        campers={restoredRegistration?.campers}
        items={
          restoredRegistration && camp
            ? mapToCampItems(camp, restoredRegistration.campers)
            : undefined
        }
      />
    );
  }

  if (camp && waiver) {
    return sessionSelectionIsComplete ? (
      <RegistrationSteps
        camp={camp}
        selectedSessions={camp.campSessions.filter((session) =>
          selectedSessions.has(session.id),
        )}
        waiver={waiver}
        onClickBack={() => setSessionSelectionIsComplete(false)}
        failedCheckoutData={restoredRegistration}
      />
    ) : (
      <SessionSelection
        camp={camp}
        selectedSessions={selectedSessions}
        setSelectedSessions={setSelectedSessions}
        onFormSubmission={() => setSessionSelectionIsComplete(true)}
      />
    );
  }

  return isLoading.camp || isLoading.waiver ? (
    <Flex h="100vh" w="100vw" align="center" justify="center">
      <Spinner />
    </Flex>
  ) : (
    <Text mx="10vw">Error: Camp not found. Please go back and try again.</Text>
  );
};

export default RegistrantExperiencePage;
