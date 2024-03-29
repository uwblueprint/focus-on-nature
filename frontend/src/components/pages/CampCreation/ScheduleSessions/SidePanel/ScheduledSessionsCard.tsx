import React from "react";
import {
  Box,
  HStack,
  Text,
  Button,
  Wrap,
  WrapItem,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import SessionDayButton from "./SessionDayButton";
import { CreateCampSession } from "../../../../../types/CampsTypes";
import {
  getFormattedDateRangeStringFromDateArray,
  getSessionBorderColor,
  getSessionDates,
} from "../../../../../utils/CampUtils";

type ScheduledSessionsCardProps = {
  currIndex: number;
  scheduledSession: CreateCampSession;
  updateSession: (index: number, updatedSession: CreateCampSession) => void;
  onDelete: (index: number) => void;
  showScheduleSessionCardError: boolean;
};

const ScheduledSessionsCard = ({
  currIndex,
  scheduledSession,
  updateSession,
  onDelete,
  showScheduleSessionCardError,
}: ScheduledSessionsCardProps): React.ReactElement => {
  const sessionDatesRangeString = getFormattedDateRangeStringFromDateArray(
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
    <FormControl isInvalid={showScheduleSessionCardError}>
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
            <Text textStyle="displayMediumBold">
              {`Session ${currIndex + 1}`}
            </Text>
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
          <Wrap>
            {Array.from(selectedWeekDays.keys()).map((day) => (
              <WrapItem key={day}>
                <SessionDayButton
                  day={day}
                  selected={selectedWeekDays.get(day)}
                  onSelect={updateSelectedSessionDays}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Box>
      {showScheduleSessionCardError && scheduledSession.dates.length === 0 && (
        <FormErrorMessage>Please select at least one day.</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default ScheduledSessionsCard;
