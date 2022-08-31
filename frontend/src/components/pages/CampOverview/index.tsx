import { Box, Container, Divider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CampResponse } from "../../../types/CampsTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import CampSessionInfoHeader from "../../common/camps/CampSessionInfoHeader";
import CampDetails from "./CampDetails";
import EmptyCampSessionState from "./CampersTable/EmptyCampSessionState";
import CampersTables from "./CampersTable/CampersTables";

const CampOverviewPage = (): JSX.Element => {
  const { id: campId }: any = useParams();
  const [currentCampSession, setCurrentCampSession] = useState(0);
  const [camp, setCamp] = useState<CampResponse>({
    id: "",
    active: false,
    ageLower: 0,
    ageUpper: 0,
    campCoordinators: [],
    campCounsellors: [],
    name: "",
    description: "",
    earlyDropoff: "",
    endTime: "",
    latePickup: "",
    location: {
      streetAddress1: "",
      city: "",
      province: "",
      postalCode: "",
    },
    startTime: "",
    fee: 0,
    formQuestions: [],
    campSessions: [],
    volunteers: "",
    campPhotoUrl: "",
  });
  const numSessions = camp.campSessions.length;

  useEffect(() => {
    const getCamp = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      if (campResponse) {
        setCamp(campResponse);
      }
    };
    getCamp();
  }, []);

  const onNextSession = () => {
    if (numSessions >= 2)
      setCurrentCampSession(
        currentCampSession === numSessions - 1 ? 0 : currentCampSession + 1,
      );
  };

  const onPrevSession = () => {
    if (numSessions >= 2)
      setCurrentCampSession(
        currentCampSession === 0 ? numSessions - 1 : currentCampSession - 1,
      );
  };

  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      background="background.grey.200"
    >
      <Box marginTop="1rem" marginX="80px">
        <></>
        <CampDetails camp={camp} setCamp={setCamp} />
        <Divider borderColor="background.grey.400" marginY="40px" />
        {camp.campSessions.length > 0 ? (
          <>
            <CampSessionInfoHeader
              camp={camp}
              currentCampSession={currentCampSession}
              onNextSession={onNextSession}
              onPrevSession={onPrevSession}
            />
            <CampersTables
              campSession={camp.campSessions[currentCampSession]}
            />
          </>
        ) : (
          <EmptyCampSessionState />
        )}
      </Box>
    </Container>
  );
};

export default CampOverviewPage;
