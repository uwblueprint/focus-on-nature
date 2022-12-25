import React from "react";
import {
  Button,
  Box,
  Image,
  Text,
  Show,
  Flex,
  AspectRatio,
} from "@chakra-ui/react";
import { CampResponse } from "../../../../types/CampsTypes";
import CampDetailsSummary from "./CampDetailsSummary";
import CampSessionBoard from "./CampSessionBoard";
import { SessionSelectionState } from "./SessionSelectionTypes";

type SesssionSelectionProps = {
  camp: CampResponse;
  selectedSessions: Set<string>;
  setSelectedSessions: (newSelections: Set<string>) => void;
  onFormSubmission: () => void;
};

const SessionSelection = ({
  camp,
  selectedSessions,
  setSelectedSessions,
  onFormSubmission,
}: SesssionSelectionProps): React.ReactElement => {
  // Set the selection mode - all selections should be waitlisted sessions
  // or all selections should be available sessions
  let selectionState = SessionSelectionState.None;

  const sessionIter = selectedSessions[Symbol.iterator]();
  const sessionId = sessionIter.next().value;
  const session = camp.campSessions.find((cs) => cs.id === sessionId);

  if (session) {
    selectionState =
      session.campers.length === session.capacity
        ? SessionSelectionState.SelectingWaitlistSessions
        : SessionSelectionState.SelectingAvailableSessions;
  }

  const addSelectedSession = (sessionID: string) => {
    setSelectedSessions(new Set(selectedSessions.add(sessionID)));
  };

  const removeSelectedSession = (sessionID: string) => {
    const newSessions = new Set(selectedSessions);
    newSessions.delete(sessionID);

    setSelectedSessions(newSessions);
  };

  const handleSessionClick = (sessionID: string) => {
    if (selectedSessions.has(sessionID)) {
      removeSelectedSession(sessionID);
    } else {
      addSelectedSession(sessionID);
    }
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
            onClick={onFormSubmission}
          >
            Register for waitlist
          </Button>
        );
      case SessionSelectionState.SelectingAvailableSessions:
        return (
          <Button colorScheme="green" px={8} onClick={onFormSubmission}>
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
    <Flex h="100vh" w="100vw" direction="row">
      <Flex
        flex={{ lg: "1" }}
        mb="72px"
        w="100%"
        overflowY={{ base: "auto", lg: "visible" }}
        direction={{ base: "column", lg: "row" }}
      >
        <Box
          h={{ lg: "100%" }}
          w={{ base: "100%", lg: "50%" }}
          overflowY={{ lg: "auto" }}
          px="5vw"
          pt="6vh"
          pb={{ lg: "6vh" }}
        >
          <Flex
            direction={{ sm: "column", md: "row", lg: "column" }}
            align={{ sm: "flex-start", md: "center", lg: "flex-start" }}
            w="100%"
          >
            <AspectRatio
              w={{ sm: "100%", md: "50%", lg: "100%" }}
              ratio={16 / 9}
            >
              <Image
                objectFit="scale-down"
                src={camp.campPhotoUrl}
                fallbackSrc="https://bit.ly/2jYM25F"
                alt="Camp Image"
              />
            </AspectRatio>
            <Box
              mt={{ sm: "8px", md: "0px", lg: "24px" }}
              ml={{ sm: "0px", md: "20px", lg: "0px" }}
            >
              <CampDetailsSummary camp={camp} />
            </Box>
          </Flex>
          <Show above="md">
            <Text
              mt="24px"
              mb="16px"
              textStyle={{ base: "bodyBold", sm: "xSmallBold" }}
            >
              Camp Details
            </Text>
            <Text wordBreak="break-word">{camp.description}</Text>
          </Show>
        </Box>
        <Box
          h={{ lg: "100%" }}
          w={{ base: "100%", lg: "50%" }}
          overflowY={{ lg: "auto" }}
          background={{ base: "", lg: "background.grey.200" }}
          px="5vw"
          pt={{ sm: 5, md: 8, lg: "10vh" }}
          pb="80px"
        >
          <CampSessionBoard
            camp={camp}
            selectedSessions={selectedSessions}
            selectionState={selectionState}
            handleSessionClick={handleSessionClick}
          />
        </Box>
      </Flex>
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
