import React from "react";
import { Box, Checkbox, Text } from "@chakra-ui/react";

type ScheduleSessionsProps = {
  scheduleSessionsDummyOne: boolean;
  scheduleSessionsDummyTwo: boolean;
  toggleScheduleSessionsDummyOne: () => void;
  toggleScheduleSessionsDummyTwo: () => void;
};

const ScheduleSessions = ({
  scheduleSessionsDummyOne,
  scheduleSessionsDummyTwo,
  toggleScheduleSessionsDummyOne,
  toggleScheduleSessionsDummyTwo,
}: ScheduleSessionsProps): JSX.Element => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Schedule Sessions</Text>
      <Text>scheduleSessionsDummyOne: {String(scheduleSessionsDummyOne)}</Text>
      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={scheduleSessionsDummyOne}
        onChange={toggleScheduleSessionsDummyOne}
      />
      <Text>scheduleSessionsDummyTwo: {String(scheduleSessionsDummyTwo)}</Text>
      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={scheduleSessionsDummyTwo}
        onChange={toggleScheduleSessionsDummyTwo}
      />
    </Box>
  );
};

export default ScheduleSessions;
