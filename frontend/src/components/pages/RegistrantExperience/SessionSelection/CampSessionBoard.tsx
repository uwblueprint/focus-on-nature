import React from "react";
import { Box, Text, Grid, GridItem, VStack } from "@chakra-ui/react";
import { CampResponse, CampSession } from "../../../../types/CampsTypes";
import {
  SessionCardState,
  SessionSelectionState,
} from "./SessionSelectionTypes";
import SessionCard from "./SessionCard";
import { sessionSectionTitleStyles } from "./SessionSelectionStyles";
import { sessionIsInProgressOrCompleted } from "../../../../utils/CampUtils";

type CampSessionBoardProps = {
  camp: CampResponse;
  selectedSessions: Set<string>;
  selectionState: SessionSelectionState | undefined;
  handleSessionClick: (sessionID: string) => void;
};

const buildGridItem = (
  campSession: CampSession,
  camp: CampResponse,
  cardState: SessionCardState,
  isWaitlistItem: boolean,
  onClick: (sessionId: string) => void,
): React.ReactElement => {
  return (
    <GridItem key={`selectionGrid_campSession_${campSession.id}`}>
      <SessionCard
        fee={camp.fee}
        startTime={camp.startTime}
        endTime={camp.endTime}
        campSession={campSession}
        handleClick={onClick}
        state={cardState}
        sessionIsWaitlisted={isWaitlistItem}
      />
    </GridItem>
  );
};

const CampSessionBoard = ({
  camp,
  selectedSessions,
  selectionState,
  handleSessionClick,
}: CampSessionBoardProps): React.ReactElement => {
  const getCardState = (
    id: string,
    selections: Set<string>,
    isSelectable: boolean,
  ): SessionCardState => {
    if (selections.has(id)) {
      return SessionCardState.Selected;
    }

    if (!isSelectable) {
      return SessionCardState.Disabled;
    }

    return SessionCardState.Available;
  };

  const waitlistSessionGridItems: React.ReactElement[] = [];
  const availableSessionGridItems: React.ReactElement[] = [];

  camp.campSessions.forEach((campSession) => {
    // We only show camp sessions in the future
    if (!sessionIsInProgressOrCompleted(campSession)) {
      if (campSession.campers.length === campSession.capacity) {
        const isWaitlisted = true;
        const cardSelectionAllowed =
          selectionState !== SessionSelectionState.SelectingAvailableSessions;
        waitlistSessionGridItems.push(
          buildGridItem(
            campSession,
            camp,
            getCardState(
              campSession.id,
              selectedSessions,
              cardSelectionAllowed,
            ),
            isWaitlisted,
            handleSessionClick,
          ),
        );
      } else {
        console.log("available");
        console.log(campSession.dates);
        const isWaitlisted = false;
        const cardSelectionAllowed =
          selectionState !== SessionSelectionState.SelectingWaitlistSessions;
        availableSessionGridItems.push(
          buildGridItem(
            campSession,
            camp,
            getCardState(
              campSession.id,
              selectedSessions,
              cardSelectionAllowed,
            ),
            isWaitlisted,
            handleSessionClick,
          ),
        );
      }
    }
  });

  console.log(availableSessionGridItems.length);

  return (
    <VStack spacing={{ sm: 5, md: 8, lg: 8 }} w="100%" align="flex-start">
      {availableSessionGridItems.length > 0 && (
        <Box w="100%">
          <Text textStyle={sessionSectionTitleStyles} mb={4}>
            Available Sessions
          </Text>
          <Grid
            templateColumns={{
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gridAutoRows="1fr"
            gap={{ sm: 2, md: 5, lg: 4 }}
          >
            {availableSessionGridItems}
          </Grid>
        </Box>
      )}
      {waitlistSessionGridItems.length > 0 && (
        <Box w="100%">
          <Text textStyle={sessionSectionTitleStyles} my={4}>
            Waitlist Only Sessions
          </Text>
          <Grid
            templateColumns={{
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gridAutoRows="1fr"
            gap={4}
          >
            {waitlistSessionGridItems}
          </Grid>
        </Box>
      )}
    </VStack>
  );
};

export default CampSessionBoard;
