import React from "react";
import { Box, HStack, Text, Button } from "@chakra-ui/react";
import SessionDayButton from "./SessionDayButton";
import { CreateCampSession } from "../../../../../types/CampsTypes";
import {
  getFormattedDateStringFromDateArray,
  getSessionBorderColor,
  getSessionDates,
} from "../../../../../utils/CampUtils";

type ScheduledSessionsCardProps = {
  currIndex: number;
  scheduledSession: CreateCampSession;
  updateSession: (index: number, updatedSession: CreateCampSession) => void;
  onDelete: (index: number) => void;
};

const ScheduledSessionsCard = ({
  currIndex,
  scheduledSession,
  updateSession,
  onDelete,
}: ScheduledSessionsCardProps): React.ReactElement => {
  const sessionDatesRangeString = getFormattedDateStringFromDateArray(
    scheduledSession.dates,
  );
  const { selectedWeekDays } = scheduledSession;

  const updateSelectedSessionDays = (day: string) => {
    // set the new start date to the sunday in the same week
    const updatedStartDate = new Date(scheduledSession.startDate.getTime());
    updatedStartDate.setDate(
      updatedStartDate.getDate() - scheduledSession.startDate.getDay(),
    );

    const updatedWeekDays = scheduledSession.selectedWeekDays;

    const daySelected: boolean = updatedWeekDays.get(day) ?? false;
    updatedWeekDays.set(day, !daySelected);

    const updatedWeekDayValues = Array.from(updatedWeekDays.values());
    const updatedDates: Date[] = getSessionDates(
      updatedStartDate,
      updatedWeekDayValues,
    );

    const updatedScheduledSession = {
      startDate: updatedStartDate,
      endDate: updatedDates[updatedDates.length - 1],
      dates: updatedDates,
      selectedWeekDays: updatedWeekDays,
    };

    updateSession(currIndex, updatedScheduledSession);
  };

  return (
    <Box
      key={currIndex}
      backgroundColor="background.white.100"
      width="100%"
      padding={5}
      borderRadius={10}
      borderColor={getSessionBorderColor(currIndex)}
      borderWidth="1.75px"
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
        <Text marginBottom={3} textStyle="bodyRegular">
          {sessionDatesRangeString}
        </Text>
        <HStack justify="space-between" flexWrap="wrap">
          {Array.from(selectedWeekDays.keys()).map((day) => (
            <SessionDayButton
              key={day}
              day={day}
              selected={selectedWeekDays.get(day)}
              onSelect={updateSelectedSessionDays}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default ScheduledSessionsCard;
