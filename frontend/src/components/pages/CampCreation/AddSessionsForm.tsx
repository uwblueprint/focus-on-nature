import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

type WeekDayButtonProps = {
  day: string;
  active: boolean | undefined;
  onSelect?: (day: string) => void;
};

const WeekDayButton = ({
  day,
  active,
  onSelect,
}: WeekDayButtonProps): JSX.Element => {
  return (
    <IconButton
      key={day}
      aria-label="week day button"
      icon={<Text>{day}</Text>}
      isRound
      size="lg"
      colorScheme={active ? "green" : "gray"}
      onClick={onSelect ? () => onSelect(day) : () => {}}
    />
  );
};

const AddSessionsForm = (): JSX.Element => {
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [successiveSessions, setSuccessiveSessions] = React.useState<number>(0);

  const [weekDays, setweekDays] = React.useState<Map<string, boolean>>(
    new Map<string, boolean>([
      ["Su", false],
      ["Mo", false],
      ["Tu", false],
      ["We", false],
      ["Th", false],
      ["Fr", false],
      ["Sa", false],
    ]),
  );

  const updateSelectedSessionDays = (day: string) => {
    const daySelected: boolean = weekDays.get(day) ?? false;
    const updatedMap = new Map<string, boolean>(
      weekDays.set(day, !daySelected),
    );
    setweekDays(updatedMap);
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
      e.preventDefault();
      setSessionDaysHasError(true);
    }
  };

  return (
    <Box paddingX="64px" paddingY="80px">
      <form onSubmit={handleSubmit}>
        <VStack align="flex-start" spacing="30px">
          <Text textStyle="displayLarge">Add Camp Session(s)</Text>
          <FormControl isRequired>
            <FormLabel>Camp Session Start Date</FormLabel>
            <Input
              type="date"
              onChange={(e: any) => {
                setStartDate(new Date(`${e.target.value}T00:00`));
              }}
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={sessionDaysHasError ? noSessionDaysSelected() : false}
          >
            <FormLabel>Session Days</FormLabel>
            <HStack spacing="10px">
              {Array.from(weekDays.keys()).map((day) => (
                <WeekDayButton
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
          <Button colorScheme="green" alignSelf="flex-end" type="submit">
            Add Camp Session(s)
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddSessionsForm;
