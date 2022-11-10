import React, { Dispatch, SetStateAction } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CreateCampSession } from "../../../../types/CampsTypes";
import SessionDayButton from "./SessionDayButton";

const emptyWeekDays = new Map<string, boolean>([
  ["Su", false],
  ["Mo", false],
  ["Tu", false],
  ["We", false],
  ["Th", false],
  ["Fr", false],
  ["Sa", false],
]);

type AddSessionsFormProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: Dispatch<SetStateAction<CreateCampSession[]>>;
  setShowAddSessions: Dispatch<SetStateAction<boolean>>;
};

const AddSessionsForm = ({
  scheduledSessions,
  setScheduledSessions,
  setShowAddSessions,
}: AddSessionsFormProps): JSX.Element => {
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [successiveSessions, setSuccessiveSessions] = React.useState<number>(0);

  const [selectedWeekDays, setSelectedWeekDays] = React.useState<
    Map<string, boolean>
  >(new Map(emptyWeekDays));

  const updateSelectedSessionDays = (day: string) => {
    const daySelected: boolean = selectedWeekDays.get(day) ?? false;
    const updatedMap = new Map<string, boolean>(
      selectedWeekDays.set(day, !daySelected),
    );
    setSelectedWeekDays(updatedMap);
  };

  const noSessionDaysSelected = (): boolean => {
    return !Array.from(selectedWeekDays.values()).find((val) => val === true);
  };

  const [sessionDaysHasError, setSessionDaysHasError] = React.useState(false);

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

  const onAddSesssionsToCamp = (e: any) => {
    if (noSessionDaysSelected()) {
      setSessionDaysHasError(true);
    } else {
      const updatedSessions: CreateCampSession[] = Object.assign(
        [],
        scheduledSessions,
      );
      const selectedWeekDayValues = Array.from(selectedWeekDays.values());

      // create a new session a week from the start date for each successive session
      // 0 successive sessions means create just one session from the start date
      // 1 success session means create one session from the start date and another session a week after
      for (let i = 0; i <= successiveSessions; i += 1) {
        const sessionStartDate = new Date(startDate.getTime());
        sessionStartDate.setDate(sessionStartDate.getDate() + i * 7);

        const newCampSession: CreateCampSession = {
          startDate: sessionStartDate,
          endDate: new Date(),
          dates: [],
          selectedWeekDays,
        };

        const dates: Date[] = getSessionDates(
          sessionStartDate,
          selectedWeekDayValues,
        );
        newCampSession.dates = dates;
        // eslint-disable-next-line prefer-destructuring
        newCampSession.startDate = dates[0];
        newCampSession.endDate = dates[dates.length - 1];
        updatedSessions.push(newCampSession);
      }

      // scheduled sessions need to be sorted by start date
      updatedSessions.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      );
      setScheduledSessions(updatedSessions);

      // reset form states
      setStartDate(new Date());
      setSuccessiveSessions(0);
      setSelectedWeekDays(new Map(emptyWeekDays));

      // hide form and show scheduled sessions list
      setShowAddSessions(false);
    }
    e.preventDefault();
  };

  return (
    <Box paddingX="64px" paddingY="80px">
      <Text textStyle="displayLarge" marginBottom={10}>
        Add Camp Session(s)
      </Text>
      <form onSubmit={onAddSesssionsToCamp}>
        <VStack align="flex-start" spacing="30px">
          <FormControl isRequired>
            <FormLabel>Camp Session Start Date</FormLabel>
            <Input
              type="date"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStartDate(new Date(`${e.target.value}T00:00`))
              }
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={sessionDaysHasError ? noSessionDaysSelected() : false}
          >
            <FormLabel>Session Days</FormLabel>
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
            <FormErrorMessage>Select at least one day</FormErrorMessage>
          </FormControl>
          <HStack>
            <Text>Add </Text>
            <Input
              type="number"
              maxWidth="5vw"
              onChange={(e: any) => {
                if (e.target.value) setSuccessiveSessions(e.target.value);
              }}
            />
            <Text> successive camp sessions</Text>
          </HStack>
          <HStack alignSelf="flex-end">
            {scheduledSessions.length !== 0 && (
              <Button
                variant="secondary"
                onClick={() => setShowAddSessions(false)}
              >
                Cancel
              </Button>
            )}
            <Button variant="primary" type="submit">
              Add Camp Session(s)
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default AddSessionsForm;
