import React from "react";
import { Box, HStack, Text, Button } from "@chakra-ui/react";
import { CreateCampSession } from "../../../../types/CampsTypes";
import SessionDayButton from "./SessionDayButton";
import { getSessionDatesRangeString } from "../../../../utils/CampUtils";

type ScheduledSessionsCardProps = {
  currIndex: number;
  scheduledSession: CreateCampSession;
  updateSession: (index: number, updatedSession: CreateCampSession) => void;
  onDelete: (index: number) => void;
};

// get dates of the selected week days within a week of the start date
const getSessionDates = (
  sessionStartDate: Date,
  selectedWeekDayValues: boolean[],
): Date[] => {
  const dates: Date[] = [];

  let currDay = sessionStartDate.getDay();
  for (
    let daysAfterStartDate = 0;
    daysAfterStartDate < 7;
    daysAfterStartDate += 1
  ) {
    // only add days that the user selected
    // e.g. only add Mondays - Fridays dates, don't add weekends
    if (selectedWeekDayValues[currDay]) {
      const newDate = new Date(sessionStartDate.getTime());
      newDate.setDate(newDate.getDate() + daysAfterStartDate);
      dates.push(newDate);
    }
    currDay = (currDay + 1) % 7;
  }
  return dates;
};

const ScheduledSessionsCard = ({
  currIndex,
  scheduledSession,
  updateSession,
  onDelete,
}: ScheduledSessionsCardProps): JSX.Element => {
  const sessionDatesRangeString = getSessionDatesRangeString(scheduledSession);
  const { selectedWeekDays } = scheduledSession;

  const updateSelectedSessionDays = (day: string) => {
    const updatedScheduledSession = scheduledSession;

    const weekDays = updatedScheduledSession.selectedWeekDays;

    const daySelected: boolean = weekDays.get(day) ?? false;
    weekDays.set(day, !daySelected);

    const sessionStartDate = scheduledSession.startDate;
    const selectedWeekDayValues = Array.from(weekDays.values());

    const newDates: Date[] = getSessionDates(
      sessionStartDate,
      selectedWeekDayValues,
    );

    updatedScheduledSession.dates = newDates;
    // eslint-disable-next-line prefer-destructuring
    updatedScheduledSession.startDate = newDates[0];
    updatedScheduledSession.endDate = newDates[newDates.length - 1];

    updateSession(currIndex, updatedScheduledSession);
  };

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
        <Text marginBottom={3} textStyle="bodyRegular">
          {sessionDatesRangeString}
        </Text>
        <HStack spacing="10px">
          {Array.from(selectedWeekDays.keys()).map((day) => (
            <SessionDayButton
              key={day}
              day={day}
              active={selectedWeekDays.get(day)}
              onSelect={updateSelectedSessionDays}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default ScheduledSessionsCard;
