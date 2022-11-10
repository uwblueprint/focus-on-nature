import React from "react";
import { Box, HStack, Text, Button, Divider, VStack } from "@chakra-ui/react";
import { CreateCampSession } from "../../../../types/CampsTypes";
import ScheduledSessionsCard from "./ScheduledSessionsCard";

type CurrentSessionsViewProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: (sessions: Array<CreateCampSession>) => void;
  setShowAddSessions: (showView: boolean) => void;
};

const CurrentSessionsView = ({
  scheduledSessions,
  setScheduledSessions,
  setShowAddSessions,
}: CurrentSessionsViewProps): JSX.Element => {
  const deleteSession = (index: number) => {
    const updatedSessions = scheduledSessions.slice(0);
    updatedSessions.splice(index, 1);
    setScheduledSessions(updatedSessions);
  };

  return (
    <Box paddingX="64px" paddingY="80px">
      <HStack justifyContent="space-between">
        <Text textStyle="displayLarge">Current Sessions</Text>
        <Button variant="primary" onClick={() => setShowAddSessions(true)}>
          Add more session(s)
        </Button>
      </HStack>
      <Divider marginY={5} />
      <Box height="80vh" overflowY="scroll">
        <VStack alignItems="flex-start" spacing={5}>
          <>
            {scheduledSessions.map((session, currIndex) => (
              <ScheduledSessionsCard
                key={currIndex}
                currIndex={currIndex}
                scheduledSession={session}
                onDelete={deleteSession}
              />
            ))}
          </>
        </VStack>
      </Box>
    </Box>
  );
};

export default CurrentSessionsView;
