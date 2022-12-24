import React, { useState } from "react";
import {
  Button,
  Box,
  Image,
  Grid,
  Text,
  GridItem,
  Show,
  Flex,
  AspectRatio,
} from "@chakra-ui/react";
import { CampResponse } from "../../../../types/CampsTypes";
import CampDetails from "./CampDetails";
import CampSessionBoard from "./CampSessionBoard";
import { SessionSelectionState } from "./SessionSelectionTypes";

type SesssionSelectionProps = {
  camp: CampResponse;
  setSelectedSessionsIds: (newSelections: string[]) => void;
};

const SessionSelection = ({
  camp,
  setSelectedSessionsIds,
}: SesssionSelectionProps): React.ReactElement => {
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(
    new Set(),
  );

  const [selectionState, setSelectionState] = useState(
    SessionSelectionState.None,
  );

  const addSelectedSession = (
    sessionID: string,
    sessionType: SessionSelectionState,
  ) => {
    setSelectedSessions(new Set(selectedSessions.add(sessionID)));

    if (selectionState === SessionSelectionState.None) {
      setSelectionState(sessionType);
    }
  };

  const removeSelectedSession = (sessionID: string) => {
    const newSessions = new Set(selectedSessions);
    newSessions.delete(sessionID);

    setSelectedSessions(newSessions);

    if (newSessions.size === 0) {
      setSelectionState(SessionSelectionState.None);
    }
  };

  const handleSessionClick = (
    sessionID: string,
    sessionType: SessionSelectionState,
  ) => {
    if (selectedSessions.has(sessionID)) {
      removeSelectedSession(sessionID);
    } else {
      addSelectedSession(sessionID, sessionType);
    }
  };

  const handleFormSubmission = () => {
    // Acts as a "save" aciton, propagating these values up to parent which will then
    // render the registration steps
    setSelectedSessionsIds(Array.from(selectedSessions));
  };

  const getFooterButton = (
    selectingState: SessionSelectionState,
  ): React.ReactElement => {
    switch (selectingState) {
      case SessionSelectionState.SelectingWaitlistSessions:
        return (
          <Button
            colorScheme="green"
            variant="outline"
            px={8}
            onClick={handleFormSubmission}
          >
            Register for waitlist
          </Button>
        );
      case SessionSelectionState.SelectingAvailableSessions:
        return (
          <Button colorScheme="green" px={8} onClick={handleFormSubmission}>
            Sign up now
          </Button>
        );
      default:
        return (
          <Button colorScheme="green" px={8} disabled>
            Sign up now
          </Button>
        );
    }
  };

  return (
    <Flex h="100vh" w="100vw">
      <Grid templateColumns="repeat(2, 1fr)" flex="1" mb="72px">
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={2} m={5}>
              <GridItem colSpan={{ sm: 2, md: 1, lg: 2 }}>
                <Box width="40%">
                  <AspectRatio marginLeft="24px" ratio={16 / 9}>
                    <Image
                      objectFit="scale-down"
                      src={camp.campPhotoUrl}
                      fallbackSrc="https://bit.ly/2jYM25F"
                      alt="Camp Image"
                    />
                  </AspectRatio>
                </Box>
              </GridItem>
              <GridItem colSpan={{ sm: 2, md: 1, lg: 2 }}>
                <CampDetails camp={camp} />
              </GridItem>
              <GridItem colSpan={2}>
                <Show above="md">
                  <Text as="b">Camp Details</Text>
                  <Text>{camp.description}</Text>
                </Show>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
        <GridItem
          colSpan={{ sm: 2, md: 2, lg: 1 }}
          px={{ sm: 4, md: 4, lg: 12 }}
          pt={{ lg: 14 }}
          pb="148px"
          bg={{ base: "", lg: "RGBA(0, 0, 0, 0.04)" }}
        >
          <CampSessionBoard
            camp={camp}
            selectedSessions={selectedSessions}
            selectionState={selectionState}
            handleSessionClick={handleSessionClick}
          />
        </GridItem>
      </Grid>
      <Flex
        direction="row"
        justify="flex-end"
        background="white"
        width="100%"
        py={4}
        px={10}
        bottom="0"
        position="fixed"
      >
        {getFooterButton(selectionState)}
      </Flex>
    </Flex>
  );
};

export default SessionSelection;
