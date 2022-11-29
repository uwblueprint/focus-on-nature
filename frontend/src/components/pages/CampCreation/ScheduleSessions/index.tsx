import React from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
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
    <Flex justify="flex-end" w="100%" h="100%">
      <VStack alignItems="center" py="5vh" px="5vw" flex="1">
        <Box>
          <Text textStyle="displayXLarge">Schedule Sessions</Text>
          <Text textStyle="heading" mb={8}>
            {campTitle}
          </Text>
          <SessionsCalendar sessions={scheduledSessions} />
        </Box>
      </VStack>
      <SessionSidePanel
        scheduledSessions={scheduledSessions}
        setScheduledSessions={setScheduledSessions}
      />
    </Flex>
  );
};

export default ScheduleSessions;
