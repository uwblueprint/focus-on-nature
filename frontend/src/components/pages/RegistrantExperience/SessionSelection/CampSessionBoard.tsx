import React from "react";
import { Box, Text, Grid, GridItem, VStack } from "@chakra-ui/react";
import {
  CampResponse,
  CampSessionResponse,
} from "../../../../types/CampsTypes";
import {
  SessionCardState,
  SessionSelectionState,
} from "./SessionSelectionTypes";
import SessionCard from "./SessionCard";
import { sessionSectionTitleStyles } from "./SessionSelectionStyles";

type CampSessionBoardProps = {
  camp: CampResponse;
  selectedSessions: Set<string>;
  selectionState: SessionSelectionState;
  handleSessionClick: (
    sessionID: string,
    sessionType: SessionSelectionState,
  ) => void;
};

const CampSessionBoard = ({
  camp,
  selectedSessions,
  selectionState,
  handleSessionClick,
}: CampSessionBoardProps): React.ReactElement => {
  const getCardState = (
    id: string,
    isSelectable: boolean,
  ): SessionCardState => {
    if (selectedSessions.has(id)) {
      return SessionCardState.Selected;
    }

    if (!isSelectable) {
      return SessionCardState.Disabled;
    }

    return SessionCardState.Available;
  };

  return (
    <VStack spacing={{ sm: 5, md: 8, lg: 8 }} w="100%" align="flex-start">
      <Box w="100%">
        <Text textStyle={sessionSectionTitleStyles} my={4}>
          Available Camps
        </Text>
        <Grid
          templateColumns={{
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={{ sm: 2, md: 5, lg: 4 }}
        >
          {camp.campSessions.reduce(
            (array: React.ReactElement[], campSession) => {
              if (campSession.campers.length !== campSession.capacity) {
                array.push(
                  <GridItem key={campSession.id}>
                    <SessionCard
                      fee={camp.fee}
                      startTime={camp.startTime}
                      endTime={camp.endTime}
                      campSession={campSession as CampSessionResponse}
                      handleClick={handleSessionClick}
                      state={getCardState(
                        campSession.id,
                        selectionState !==
                          SessionSelectionState.SelectingWaitlistSessions,
                      )}
                      sessionIsWaitlisted={false}
                    />
                  </GridItem>,
                );
              }
              return array;
            },
            [],
          )}
        </Grid>
      </Box>
      <Box w="100%">
        <Text textStyle={sessionSectionTitleStyles} as="b" mt={4} mb={4}>
          Waitlist Only Camps
        </Text>
        <Grid
          templateColumns={{
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={4}
        >
          {camp.campSessions.reduce(
            (array: React.ReactElement[], campSession) => {
              if (campSession.campers.length === campSession.capacity) {
                array.push(
                  <GridItem key={campSession.id}>
                    <SessionCard
                      fee={camp.fee}
                      startTime={camp.startTime}
                      endTime={camp.endTime}
                      campSession={campSession as CampSessionResponse}
                      handleClick={handleSessionClick}
                      state={getCardState(
                        campSession.id,
                        selectionState !==
                          SessionSelectionState.SelectingAvailableSessions,
                      )}
                      sessionIsWaitlisted
                    />
                  </GridItem>,
                );
              }
              return array;
            },
            [],
          )}
        </Grid>
      </Box>
    </VStack>
  );
};

export default CampSessionBoard;
