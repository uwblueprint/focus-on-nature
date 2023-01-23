import React from "react";
import { Box, Text, VStack, Flex, useMediaQuery } from "@chakra-ui/react";
import { CampSessionResponse } from "../../../../types/CampsTypes";
import { SessionCardState } from "./SessionSelectionTypes";
import {
  sessionCardBoldTextStyles,
  sessionCardDatesTextStyles,
  sessionCardDetailsTextStyles,
} from "./SessionSelectionStyles";
import { getMeridianTime, sortDateStrings } from "../../../../utils/CampUtils";

const WAITLISTED_COLOR = "red.100";
const AVAILABLE_COLOR = "green.100";
const HOVERED_COLOR = "RGBA(0, 0, 0, 0.16)";

type SessionCardDetailsProps = {
  fee: number;
  startTime: string;
  endTime: string;
  campSession: CampSessionResponse;
};

const SessionCardDetails = ({
  fee,
  startTime,
  endTime,
  campSession,
}: SessionCardDetailsProps): React.ReactElement => {
  const getCampSessionDates = () => {
    const datesToUse = sortDateStrings(campSession.dates);
    const startDate = new Date(datesToUse[0]);
    const endDate = new Date(datesToUse[campSession.dates.length - 1]);
    return `${startDate.toLocaleString("default", {
      month: "short",
    })} ${startDate.getDate()} - ${endDate.toLocaleString("default", {
      month: "short",
    })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  };

  const formattedTimeString = (start: string, end: string): string => {
    return `${getMeridianTime(start)} - ${getMeridianTime(end)}`;
  };

  const [isMobile] = useMediaQuery("(max-width: 767px)");
  return (
    <>
      <Text textStyle={sessionCardDatesTextStyles}>
        {getCampSessionDates()}
      </Text>
      {isMobile ? (
        <>
          <Text textStyle={sessionCardDetailsTextStyles}>
            {formattedTimeString(startTime, endTime)}
          </Text>
          <Text textStyle={sessionCardDetailsTextStyles}>${fee}</Text>
        </>
      ) : (
        <Text textStyle={sessionCardDetailsTextStyles}>
          {formattedTimeString(startTime, endTime)} · ${fee}
        </Text>
      )}
    </>
  );
};

type SessionCardProps = {
  fee: number;
  startTime: string;
  endTime: string;
  campSession: CampSessionResponse;
  handleClick: (sessionID: string) => void;
  state: SessionCardState;
  sessionIsWaitlisted: boolean;
};

const SessionCard = ({
  fee,
  startTime,
  endTime,
  campSession,
  handleClick,
  state,
  sessionIsWaitlisted,
}: SessionCardProps): React.ReactElement => {
  const handleCardClick = () => {
    if (state !== SessionCardState.Disabled) {
      handleClick(campSession.id);
    }
  };

  let backgroundColour = "white";

  if (state === SessionCardState.Selected) {
    backgroundColour = sessionIsWaitlisted ? WAITLISTED_COLOR : AVAILABLE_COLOR;
  }

  return (
    <Box
      bg={backgroundColour}
      h="100%"
      p={4}
      borderColor={
        sessionIsWaitlisted ? "text.critical.100" : "primary.green.100"
      }
      borderWidth="1px"
      borderRadius="20px"
      onClick={handleCardClick}
      _hover={{
        background:
          backgroundColour !== "white" || state === SessionCardState.Disabled
            ? backgroundColour
            : HOVERED_COLOR,
      }}
      cursor={state === SessionCardState.Disabled ? "not-allowed" : "pointer"}
      opacity={state === SessionCardState.Disabled ? "0.5" : "1"}
    >
      <VStack spacing={2} w="100%" align="flex-start">
        {sessionIsWaitlisted ? (
          <Text color="text.critical.100">SESSION FULL</Text>
        ) : (
          <Flex
            direction="row"
            w="100%"
            justify="space-between"
            flexWrap="wrap"
            mt={-2}
          >
            <Text
              textStyle={sessionCardDetailsTextStyles}
              color="text.success.100"
              mt={2}
              mr={2}
            >
              AVAILABLE
            </Text>

            <Text textStyle={sessionCardBoldTextStyles} mt={2}>
              {campSession.capacity - campSession.campers.length} spots left!
            </Text>
          </Flex>
        )}
        <SessionCardDetails
          fee={fee}
          startTime={startTime}
          endTime={endTime}
          campSession={campSession}
        />
      </VStack>
    </Box>
  );
};

export default SessionCard;
