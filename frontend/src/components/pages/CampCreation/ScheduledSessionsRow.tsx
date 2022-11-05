import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { CreateCampSession } from "../../../types/CampsTypes";
import SessionDayButton from "./SessionDayButton";

type ScheduledSessionsRowProps = {
  scheduledSession: CreateCampSession;
  currIndex: number;
};

const ScheduledSessionsRow = ({
  currIndex,
  scheduledSession,
}: ScheduledSessionsRowProps): JSX.Element => {
  const weekDays: Map<string, boolean> = scheduledSession.selectedWeekDays;

  return (
    <Box
      key={currIndex}
      backgroundColor="background.white.100"
      width="100%"
      padding={5}
      borderRadius={10}
    >
      <VStack alignItems="flex-start">
        <Text textStyle="displayMediumBold">{`Session ${currIndex + 1}`}</Text>
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
