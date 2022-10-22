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

const WeekDayButton = ({ dayText }: { dayText: string }): JSX.Element => {
  return (
    <IconButton
      key={dayText}
      isRound
      icon={<Text>{dayText}</Text>}
      colorScheme="green"
      aria-label="monday"
    />
  );
};

const AddSessionsForm = (): JSX.Element => {
  const weekDays = new Map<string, boolean>([
    ["Su", false],
    ["Mo", false],
    ["Tu", false],
    ["We", false],
    ["Th", false],
    ["Fr", false],
    ["Sa", false],
  ]);

  const weekDayKeys: string[] = Array.from(weekDays.keys());

  return (
    <Box paddingX="64px" paddingY="80px">
      <VStack align="flex-start" spacing="30px">
        <Text textStyle="displayLarge">Add Camp Session(s)</Text>
        <FormControl isRequired>
          <FormLabel>Camp Session Start Date</FormLabel>
          <Input type="date" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Session Days</FormLabel>
          <HStack spacing="10px">
            {weekDayKeys.map((day) => (
              <WeekDayButton dayText={day} key={day} />
            ))}
          </HStack>
        </FormControl>
        <HStack>
          <Text>Add </Text>
          <Input type="number" maxWidth="5vw" />
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

/*
from start date 

*/
