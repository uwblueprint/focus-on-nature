import {
  Box,
  Button,
  FormControl,
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
  onPress?: (day: string) => void;
};

const WeekDayButton = ({
  day,
  active,
  onPress,
}: WeekDayButtonProps): JSX.Element => {
  return (
    <IconButton
      key={day}
      aria-label="week day button"
      icon={<Text>{day}</Text>}
      isRound
      size="lg"
      colorScheme={active ? "green" : "gray"}
      onClick={onPress ? () => onPress(day) : () => {}}
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

  const weekDayKeys: string[] = Array.from(weekDays.keys());

  const updateSessionDays = (day: string) => {
    const daySelected: boolean = weekDays.get(day) ?? false;
    const updatedMap = new Map<string, boolean>(
      weekDays.set(day, !daySelected),
    );
    setweekDays(updatedMap);
  };

  console.log(startDate);

  return (
    <Box paddingX="64px" paddingY="80px">
      <VStack align="flex-start" spacing="30px">
        <Text textStyle="displayLarge">Add Camp Session(s)</Text>
        <FormControl isRequired>
          <FormLabel>Camp Session Start Date</FormLabel>
          <Input
            type="date"
            onChange={(e: any) => {
              setStartDate(e.target.value);
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Session Days</FormLabel>
          <HStack spacing="10px">
            {weekDayKeys.map((day) => (
              <WeekDayButton
                key={day}
                day={day}
                active={weekDays.get(day)}
                onPress={updateSessionDays}
              />
            ))}
          </HStack>
        </FormControl>
        <HStack>
          <Text>Add </Text>
          <Input
            type="number"
            maxWidth="5vw"
            onChange={(e: any) => {
              setSuccessiveSessions(e.target.value);
            }}
          />
          <Text> successive camp sessions</Text>
        </HStack>
        <Button colorScheme="green" alignSelf="flex-end">
          Add Camp Session(s)
        </Button>
      </VStack>
    </Box>
  );
};

export default AddSessionsForm;
