import { Box, HStack, Text, Button } from "@chakra-ui/react";
import React from "react";
import { CreateCampSession } from "../../../types/CampsTypes";
import SessionDayButton from "./SessionDayButton";

type ScheduledSessionsRowProps = {
  currIndex: number;
  scheduledSession: CreateCampSession;
  onDelete: (index: number) => void;
};

const ScheduledSessionsRow = ({
  currIndex,
  scheduledSession,
  onDelete,
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
      <Box alignItems="flex-start" flexDirection="column">
        <HStack justifyContent="space-between" w="full">
          <Text textStyle="displayMediumBold">{`Session ${
            currIndex + 1
          }`}</Text>
          <Button
            onClick={() => onDelete(currIndex)}
            bgColor="background.white.100"
            color="text.critical.100"
            _hover={{ bg: "background.grey.100" }}
          >
            Delete
          </Button>
        </HStack>
        <Text
          marginBottom={3}
          textStyle="bodyRegular"
        >{`${scheduledSession.startDate.toDateString()} - ${scheduledSession.endDate.toDateString()}`}</Text>
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
      </Box>
    </Box>
  );
};

export default ScheduledSessionsRow;
