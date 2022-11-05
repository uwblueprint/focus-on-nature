import { Box, HStack, Text, VStack, Button } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { CreateCampSession } from "../../../types/CampsTypes";
import SessionDayButton from "./SessionDayButton";

type ScheduledSessionsRowProps = {
  currIndex: number;
  scheduledSession: CreateCampSession;
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: Dispatch<SetStateAction<CreateCampSession[]>>;
};

const ScheduledSessionsRow = ({
  currIndex,
  scheduledSession,
  scheduledSessions,
  setScheduledSessions,
}: ScheduledSessionsRowProps): JSX.Element => {
  const weekDays: Map<string, boolean> = scheduledSession.selectedWeekDays;

  const deleteSession = () => {
    const updatedSessions = scheduledSessions.slice(0);
    updatedSessions.splice(currIndex, 1);
    setScheduledSessions(updatedSessions);
  };

  return (
    <Box
      key={currIndex}
      backgroundColor="background.white.100"
      width="100%"
      padding={5}
      borderRadius={10}
    >
      <VStack alignItems="flex-start">
        <HStack justifyContent="space-between" w="full">
          <Text textStyle="displayMediumBold">{`Session ${
            currIndex + 1
          }`}</Text>
          <Button onClick={deleteSession} colorScheme="red">
            Delete
          </Button>
        </HStack>
        <Text textStyle="bodyRegular">{`${scheduledSession.startDate.toDateString()} - ${scheduledSession.endDate.toDateString()}`}</Text>
        <HStack spacing="10px">
          {Array.from(weekDays.keys()).map((day) => (
            <SessionDayButton
              key={day}
              day={day}
              active={weekDays.get(day)}
              onSelect={() => {}}
            />
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

export default ScheduledSessionsRow;
