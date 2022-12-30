import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { Text, Spinner, Flex } from "@chakra-ui/react";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CampResponse } from "../../../types/CampsTypes";
import { SUCCESS_RESULT_CODE } from "../../../constants/RegistrationConstants";
import { restoreRegistrationSessionFromSessionStorage } from "../../../utils/RegistrationUtils";
import { CheckoutData } from "../../../types/RegistrationTypes";
import RegistrationResultPage from "./RegistrationResult";
import RegistrationSteps from "./RegistrationSteps";
import SessionSelection from "./SessionSelection";
import { Waiver as WaiverType } from "../../../types/AdminTypes";
import { WaiverInterface } from "../../../types/waiverRegistrationTypes";

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
    // We could remove this conditional, if we want to handle the "navigate back" action
    let cachedRegistration: CheckoutData | undefined;
    if (registrationResult) {
      cachedRegistration = restoreRegistrationSessionFromSessionStorage();

      if (cachedRegistration) {
        // Some data is expected by the default camp registration flow, and is
        // passed through individual state variables. Data generated in the previous
        // session (eg. checkout URL) is passed via `restoredRegistration` field,
        // which is `undefined` if by default if no previous sessions exists.
        setRestoredRegistration(cachedRegistration);

        setSelectedSessions(new Set(cachedRegistration.selectedSessionIds));
        setSessionSelectionIsComplete(true);
        setCamp(cachedRegistration.camp);
        setWaiver(cachedRegistration.waiverInterface.waiver);
      }
    }

    // If we expect session cache to exist, and it doesn't exist, do not repopulate
    // via network call -- instead show generic message in RegistrationResult in case
    // the user entered `?result=success` manually into the URL (so no actually success)
    if (!cachedRegistration && registrationResult !== SUCCESS_RESULT_CODE) {
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
    const sessionsIds = new Set(restoredRegistration?.selectedSessionIds);

    return (
      <RegistrationResultPage
        camp={camp}
        campers={restoredRegistration?.campers}
        sessions={
          camp?.campSessions.filter((session) => sessionsIds.has(session.id)) ??
          []
        }
        chargeId={restoredRegistration?.chargeId}
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
