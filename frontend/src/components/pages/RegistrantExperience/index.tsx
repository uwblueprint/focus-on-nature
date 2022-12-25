import React, { useEffect, useState } from "react";
import { Text, Spinner, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CampResponse } from "../../../types/CampsTypes";
import RegistrationSteps from "./RegistrationSteps";
import SessionSelection from "./SessionSelection";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { Waiver } from "../../../types/AdminTypes";

const RegistrantExperiencePage = (): React.ReactElement => {
  const { id: campId } = useParams<{ id: string }>();

  const [campResponse, setCampResponse] = useState<CampResponse | undefined>(
    undefined,
  );
  const [waiverResponse, setWaiverResponse] = useState<Waiver | undefined>(
    undefined,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(
    new Set(),
  );
  const [sessionSelectionIsComplete, setSessionSelectionIsComplete] = useState(
    false,
  );

  useEffect(() => {
    CampsAPIClient.getCampById(campId).then((camp) =>
      camp.id ? setCampResponse(camp) : null,
    );

    AdminAPIClient.getWaiver().then((waiver) =>
      waiver.clauses ? setWaiverResponse(waiver) : null,
    );

    setIsLoading(false);
  }, [campId]);

  if (campResponse && waiverResponse) {
    return sessionSelectionIsComplete ? (
      <RegistrationSteps
        camp={campResponse}
        selectedSessions={campResponse.campSessions.filter((session) =>
          selectedSessions.has(session.id),
        )}
        waiver={waiverResponse}
        onClickBack={() => setSessionSelectionIsComplete(false)}
      />
    ) : (
      <SessionSelection
        camp={campResponse}
        selectedSessions={selectedSessions}
        setSelectedSessions={setSelectedSessions}
        onFormSubmission={() => setSessionSelectionIsComplete(true)}
      />
    );
  }

  return isLoading ? (
    <Flex h="100vh" w="100vw" align="center" justify="center">
      <Spinner />
    </Flex>
  ) : (
    <Text mx="10vw">Error: Camp not found. Please go back and try again.</Text>
  );
};

export default RegistrantExperiencePage;
