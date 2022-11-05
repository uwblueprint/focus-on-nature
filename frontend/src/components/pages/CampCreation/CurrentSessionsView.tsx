import { Box, HStack, Text, Button, Divider, VStack } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { CreateCampSession } from "../../../types/CampsTypes";
import ScheduledSessionsRow from "./ScheduledSessionsRow";

type CurrentSessionsViewProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: Dispatch<SetStateAction<CreateCampSession[]>>;
  setShowAddSessions: Dispatch<SetStateAction<boolean>>;
};

const CurrentSessionsView = ({
  scheduledSessions,
  setScheduledSessions,
  setShowAddSessions,
}: CurrentSessionsViewProps): JSX.Element => {
  return (
    <Box paddingX="64px" paddingY="80px">
      <HStack justifyContent="space-between">
        <Text textStyle="displayLarge">Current Sessions</Text>
        <Button colorScheme="green" onClick={() => setShowAddSessions(true)}>
          Add more session(s)
        </Button>
      </HStack>
      <Divider marginY={5} />
      <VStack alignItems="flex-start" spacing={5}>
        <>
          {scheduledSessions.map((session, currIndex) => (
            <ScheduledSessionsRow
              key={currIndex}
              currIndex={currIndex}
              scheduledSession={session}
            />
          ))}
        </>
      </VStack>
    </Box>
  );
};

export default CurrentSessionsView;
