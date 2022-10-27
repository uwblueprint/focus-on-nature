import React from "react";
import { Box, Checkbox, HStack, Text, VStack } from "@chakra-ui/react";
import { CreateCampSession } from "../../../../types/CampsTypes";
import SessionSidePanel from "./SidePanel";
import SessionsCalendar from "./Calendar";

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
}: ScheduleSessionsProps): React.ReactElement => {
  const [scheduledSessions, setScheduledSessions] = React.useState<
    CreateCampSession[]
  >([]);

  return (
    <Box m={-20}>
      <HStack alignItems="flex-start" h="inherit">
        <VStack alignItems="flex-start" m={20}>
          <Text textStyle="displayXLarge">Schedule Sessions</Text>
          <Text textStyle="heading" mb={8}>
            Waterloo Photography Camp 2022 @7:00 AM - 3:00PM
          </Text>
          <Text>
            scheduleSessionsDummyOne: {String(scheduleSessionsDummyOne)}
          </Text>
          <Checkbox
            size="lg"
            borderColor="black"
            isChecked={scheduleSessionsDummyOne}
            onChange={toggleScheduleSessionsDummyOne}
          />
          <Text>
            scheduleSessionsDummyTwo: {String(scheduleSessionsDummyTwo)}
          </Text>
          <Checkbox
            size="lg"
            borderColor="black"
            isChecked={scheduleSessionsDummyTwo}
            onChange={toggleScheduleSessionsDummyTwo}
          />
          <SessionsCalendar sessions={scheduledSessions} />
        </VStack>
        <SessionSidePanel
          scheduledSessions={scheduledSessions}
          setScheduledSessions={setScheduledSessions}
        />
      </HStack>
    </Box>
  );
};

export default ScheduleSessions;
