import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Divider,
  VStack,
  useToast,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { CreateCampSession } from "../../../../../types/CampsTypes";
import ScheduledSessionsCard from "./ScheduledSessionsCard";
import DeleteModal from "../../../../common/DeleteModal";

type CurrentSessionsViewProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: (sessions: Array<CreateCampSession>) => void;
  setShowAddSessions: (showView: boolean) => void;
  showScheduleSessionCardError: boolean;
};

const CurrentSessionsView = ({
  scheduledSessions,
  setScheduledSessions,
  setShowAddSessions,
  showScheduleSessionCardError,
}: CurrentSessionsViewProps): JSX.Element => {
  const [sessionToDeleteIndex, setSessionToDeleteIndex] = React.useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateSession = (index: number, updatedSession: CreateCampSession) => {
    const updatedSessions = [...scheduledSessions];
    updatedSessions[index] = updatedSession;
    setScheduledSessions(updatedSessions);
  };

  const deleteSession = (index: number) => {
    setSessionToDeleteIndex(index);
    onOpen();
  };

  const confirmDeleteSession = () => {
    const updatedSessions = [...scheduledSessions];
    updatedSessions.splice(sessionToDeleteIndex, 1);
    setScheduledSessions(updatedSessions);

    onClose();

    toast({
      description: `Session ${
        sessionToDeleteIndex + 1
      } has been successfully deleted`,
      status: "success",
      variant: "subtle",
      duration: 3000,
    });
  };

  return (
    <Flex direction="column" paddingX="64px" paddingY="80px" height="100%">
      <DeleteModal
        title="Delete Session?"
        bodyText={`Are you sure you want to delete "Session ${
          sessionToDeleteIndex + 1
        }?"`}
        bodyNote="Note: this action is irreversible."
        buttonLabel="Delete"
        isOpen={isOpen}
        onClose={onClose}
        onDelete={confirmDeleteSession}
      />
      <Wrap justifyContent="space-between">
        <WrapItem>
          <Text textStyle="displayLarge">Current Sessions</Text>
        </WrapItem>
        <WrapItem>
          <Button variant="secondary" onClick={() => setShowAddSessions(true)}>
            Add more session(s)
          </Button>
        </WrapItem>
      </Wrap>
      <Divider marginY={5} />
      <Box overflowY="auto" flex="1 1 0">
        <VStack alignItems="flex-start" spacing={5}>
          <>
            {scheduledSessions.map((session, currIndex) => (
              <ScheduledSessionsCard
                key={currIndex}
                currIndex={currIndex}
                scheduledSession={session}
                updateSession={updateSession}
                onDelete={deleteSession}
                showScheduleSessionCardError={showScheduleSessionCardError}
              />
            ))}
          </>
        </VStack>
      </Box>
    </Flex>
  );
};

export default CurrentSessionsView;
