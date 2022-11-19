import React from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { CreateCampSession } from "../../../../types/CampsTypes";
import SessionSidePanel from "./SidePanel";
import SessionsCalendar from "./Calendar";

type ScheduleSessionsProps = {
  campTitle: string;
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: (newSessions: CreateCampSession[]) => void;
};

const ScheduleSessions = ({
  campTitle,
  scheduledSessions,
  setScheduledSessions,
}: ScheduleSessionsProps): React.ReactElement => {
  return (
    <Box m={-20}>
      <HStack alignItems="flex-start" h="inherit">
        <VStack alignItems="flex-start" m={20}>
          <Text textStyle="displayXLarge">Schedule Sessions</Text>
          <Text textStyle="heading" mb={8}>
            {campTitle}
          </Text>
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
