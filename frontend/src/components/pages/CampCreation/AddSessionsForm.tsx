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
import React, { Dispatch, SetStateAction } from "react";
import { CreateCampSession } from "../../../types/CampsTypes";
import SessionDayButton from "./SessionDayButton";

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

  const emptyWeekDays = new Map<string, boolean>([
    ["Su", false],
    ["Mo", false],
    ["Tu", false],
    ["We", false],
    ["Th", false],
    ["Fr", false],
    ["Sa", false],
  ]);
  const [weekDays, setWeekDays] = React.useState<Map<string, boolean>>(
    new Map<string, boolean>(emptyWeekDays),
  );

  const updateSelectedSessionDays = (day: string) => {
    const daySelected: boolean = weekDays.get(day) ?? false;
    const updatedMap = new Map<string, boolean>(
      weekDays.set(day, !daySelected),
    );
    setWeekDays(updatedMap);
  };

  const noSessionDaysSelected = (): boolean => {
    let hasNoSelectedDay = true;
    Array.from(weekDays.values()).forEach((val) => {
      if (val === true) hasNoSelectedDay = false;
    });
    return hasNoSelectedDay;
  };

  const [sessionDaysHasError, setSessionDaysHasError] = React.useState(false);

  const handleSubmit = (e: any) => {
    if (noSessionDaysSelected()) {
      setSessionDaysHasError(true);
    } else {
      const updatedSessions: CreateCampSession[] = scheduledSessions.slice(0);
      const weekDayValues = Array.from(weekDays.values());

      for (let i = 0; i < successiveSessions; i += 1) {
        const sessionStartDate = new Date(startDate.getTime());
        sessionStartDate.setDate(sessionStartDate.getDate() + i * 7);

        const newCampSession: CreateCampSession = {
          startDate: sessionStartDate,
          endDate: new Date(),
          dates: [],
          selectedWeekDays: weekDays,
        };
        const dates: Date[] = [];

        let counter = 0;
        let currIndex = sessionStartDate.getDay();
        while (counter < 7) {
          if (weekDayValues[currIndex]) {
            const newDate = new Date(sessionStartDate.getTime());
            newDate.setDate(newDate.getDate() + counter);
            dates.push(newDate);
          }
          counter += 1;
          currIndex = (currIndex + 1) % 7;
        }

        newCampSession.dates = dates;
        // eslint-disable-next-line prefer-destructuring
        newCampSession.startDate = dates[0];
        newCampSession.endDate = dates[dates.length - 1];
        updatedSessions.push(newCampSession);
      }
      updatedSessions.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      );

      setScheduledSessions(updatedSessions);

      setStartDate(new Date());
      setSuccessiveSessions(0);
      setWeekDays(emptyWeekDays);
      setShowAddSessions(false);
    }
    e.preventDefault();
  };

  return (
    <Box paddingX="64px" paddingY="80px">
      <HStack justifyContent="space-between" marginBottom={10}>
        <Text textStyle="displayLarge">Add Camp Session(s)</Text>
        {scheduledSessions.length !== 0 && (
          <Button colorScheme="gray" onClick={() => setShowAddSessions(false)}>
            Cancel
          </Button>
        )}
      </HStack>
      <form onSubmit={handleSubmit}>
        <VStack align="flex-start" spacing="30px">
          <FormControl isRequired>
            <FormLabel>Camp Session Start Date</FormLabel>
            <Input
              type="date"
              onChange={(e: any) =>
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
              {Array.from(weekDays.keys()).map((day) => (
                <SessionDayButton
                  key={day}
                  day={day}
                  active={weekDays.get(day)}
                  onSelect={updateSelectedSessionDays}
                />
              ))}
            </HStack>
            <FormErrorMessage>Select at least one day</FormErrorMessage>
          </FormControl>
          <HStack>
            <Text>Add </Text>
            <FormControl isRequired width="-webkit-fit-content">
              <Input
                type="number"
                maxWidth="5vw"
                onChange={(e: any) => {
                  if (e.target.value) setSuccessiveSessions(e.target.value);
                }}
              />
            </FormControl>
            <Text> successive camp sessions</Text>
          </HStack>
          <Button variant="primaryGreen" alignSelf="flex-end" type="submit">
            Add Camp Session(s)
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddSessionsForm;
