import React, { useEffect, useState } from "react";
import { Text, Spinner, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CampResponse } from "../../../types/CampsTypes";
import RegistrationSteps from "./RegistrationSteps";
import SessionSelection from "./SessionSelection";

const RegistrantExperiencePage = (): React.ReactElement => {
  const { id: campId } = useParams<{ id: string }>();

  const [campResponse, setCampResponse] = useState<CampResponse | undefined>(
    undefined,
  );
  const [selectedSessionsIds, setSelectedSessionsIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const completedSessionSelection = selectedSessionsIds.length !== 0;

  const resetToSesssionSelection = () => setSelectedSessionsIds([]);

  useEffect(() => {
    CampsAPIClient.getCampById(campId).then((camp) => {
      if (camp.id) {
        setCampResponse(camp);
      }
      setIsLoading(false);
    });
  }, [campId]);

  if (campResponse) {
    return completedSessionSelection ? (
      <RegistrationSteps
        camp={campResponse}
        onClickBack={resetToSesssionSelection}
      />
    ) : (
      <SessionSelection
        camp={campResponse}
        setSelectedSessionsIds={setSelectedSessionsIds}
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
