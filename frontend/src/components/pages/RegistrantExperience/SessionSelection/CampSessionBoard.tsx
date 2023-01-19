import React from "react";
import { Box, Text, Grid, GridItem, VStack } from "@chakra-ui/react";
import { CampResponse } from "../../../../types/CampsTypes";
import {
  SessionCardState,
  SessionSelectionState,
} from "./SessionSelectionTypes";
import SessionCard from "./SessionCard";
import { sessionSectionTitleStyles } from "./SessionSelectionStyles";

type CampSessionBoardProps = {
  camp: CampResponse;
  selectedSessions: Set<string>;
  selectionState: SessionSelectionState | undefined;
  handleSessionClick: (sessionID: string) => void;
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
    if (campSession.campers.length === campSession.capacity) {
      const cardSelectionAllowed =
        selectionState !== SessionSelectionState.SelectingAvailableSessions;
      waitlistSessionGridItems.push(
        <GridItem key={campSession.id}>
          <SessionCard
            fee={camp.fee}
            startTime={camp.startTime}
            endTime={camp.endTime}
            campSession={campSession}
            handleClick={handleSessionClick}
            state={getCardState(
              campSession.id,
              selectedSessions,
              cardSelectionAllowed,
            )}
            sessionIsWaitlisted
          />
        </GridItem>,
      );
    } else {
      const cardSelectionAllowed =
        selectionState !== SessionSelectionState.SelectingWaitlistSessions;
      availableSessionGridItems.push(
        <GridItem key={campSession.id} className="bo">
          <SessionCard
            fee={camp.fee}
            startTime={camp.startTime}
            endTime={camp.endTime}
            campSession={campSession}
            handleClick={handleSessionClick}
            state={getCardState(
              campSession.id,
              selectedSessions,
              cardSelectionAllowed,
            )}
            sessionIsWaitlisted={false}
          />
        </GridItem>,
      );
    }
  });

  return (
    <VStack spacing={{ sm: 5, md: 8, lg: 8 }} w="100%" align="flex-start">
      {availableSessionGridItems.length > 0 && (
        <Box w="100%">
          <Text textStyle={sessionSectionTitleStyles} mb={4}>
            Available Camps
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
            Waitlist Only Camps
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
