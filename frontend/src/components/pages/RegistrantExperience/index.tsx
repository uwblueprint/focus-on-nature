import React, { useEffect, useState } from "react";
import { Text, Spinner, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";

import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CampResponse } from "../../../types/CampsTypes";
import RegistrationSteps from "./RegistrationSteps";
import SessionSelection from "./SessionSelection";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { Waiver } from "../../../types/AdminTypes";
import { WaitlistedCamper } from "../../../types/CamperTypes";

type InitialLoadingState = {
  waiver: boolean;
  camp: boolean;
};

const RegistrantExperiencePage = (): React.ReactElement => {
  const toast = useToast();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id: campId } = useParams<{ id: string }>();
  const waitlistedSessionId = searchParams.get("waitlistedSessionId");
  const waitlistedCamperId = searchParams.get("waitlistedCamperId");

  const [campResponse, setCampResponse] = useState<CampResponse | undefined>(
    undefined,
  );
  const [waiverResponse, setWaiverResponse] = useState<Waiver | undefined>(
    undefined,
  );

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
  const [waitlistedCamper, setWaitlistedCamper] = useState<WaitlistedCamper>();

  useEffect(() => {
    CampsAPIClient.getCampById(campId)
      .then((camp) => {
        if (camp.id) {
          setCampResponse(camp);

          if (waitlistedSessionId && waitlistedCamperId) {
            // Ensure the given waitlisted session id is in the camp sessions of this camp
            const waitlistedCampSession = camp.campSessions.find(
              (cs) => cs.id === waitlistedSessionId,
            );
            if (!waitlistedCampSession) {
              toast({
                description: `Could not find requested session to register for in this camp.`,
                status: "error",
                variant: "subtle",
                duration: 3000,
              });
              return;
            }
            // Find the waitlisted camper id in the list of waitlisted campers in the given session
            const waitlistCamper = waitlistedCampSession.waitlist.find(
              (camper) => camper.id === waitlistedCamperId,
            );
            if (!waitlistCamper) {
              toast({
                description: `Could not find details of requested waitlisted camper for this camp session.`,
                status: "error",
                variant: "subtle",
                duration: 3000,
              });
              return;
            }
            setSessionSelectionIsComplete(true);
            setWaitlistedCamper(waitlistCamper);
            setSelectedSessions(new Set(waitlistedSessionId));
          }
        }
      })
      .finally(() =>
        setIsLoading((i) => {
          return { ...i, camp: false };
        }),
      );

    AdminAPIClient.getWaiver()
      .then((waiver) => (waiver.clauses ? setWaiverResponse(waiver) : null))
      .finally(() =>
        setIsLoading((i) => {
          return {
            ...i,
            waiver: false,
          };
        }),
      );
  }, [campId, waitlistedSessionId, waitlistedCamperId, toast]);

  if (campResponse && waiverResponse) {
    return sessionSelectionIsComplete ? (
      <RegistrationSteps
        camp={campResponse}
        selectedSessions={campResponse.campSessions.filter((session) =>
          selectedSessions.has(session.id),
        )}
        waiver={waiverResponse}
        onClickBack={() => setSessionSelectionIsComplete(false)}
        waitlistedCamper={waitlistedCamper}
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

  return isLoading.camp || isLoading.waiver ? (
    <Flex h="100vh" w="100vw" align="center" justify="center">
      <Spinner />
    </Flex>
  ) : (
    <Text mx="10vw">Error: Camp not found. Please go back and try again.</Text>
  );
};

export default RegistrantExperiencePage;
