import React from "react";
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
import { CreateCampSession } from "../../../../../types/CampsTypes";
import SessionDayButton from "./SessionDayButton";
import {
  getSessionDates,
  sortScheduledSessions,
} from "../../../../../utils/CampUtils";

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
  setScheduledSessions: (sessions: Array<CreateCampSession>) => void;
  setShowAddSessions: (showView: boolean) => void;
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

  const resetFormStates = () => {
    setStartDate(new Date());
    setSuccessiveSessions(0);
    setSelectedWeekDays(new Map(emptyWeekDays));
  };

  const onAddSesssionsToCamp = (e: React.FormEvent) => {
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
          selectedWeekDays: new Map(selectedWeekDays),
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

      setScheduledSessions(sortScheduledSessions(updatedSessions));
      resetFormStates();

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
            isInvalid={sessionDaysHasError && noSessionDaysSelected()}
          >
            <FormLabel>Session Days</FormLabel>
            <HStack spacing="10px">
              {Array.from(selectedWeekDays.keys()).map((day) => (
                <SessionDayButton
                  key={day}
                  day={day}
                  selected={selectedWeekDays.get(day)}
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
              defaultValue={0}
              maxWidth="5vw"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value) setSuccessiveSessions(+e.target.value);
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
