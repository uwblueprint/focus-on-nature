import React from "react";
import { Box } from "@chakra-ui/react";
import AddSessionsForm from "./AddSessionsForm";
import CurrentSessionsView from "./CurrentSessionsView";
import { CreateCampSession } from "../../../../../types/CampsTypes";

type SessionSidePanelProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: (sessions: Array<CreateCampSession>) => void;
  showScheduleSessionCardError: boolean;
};

const SessionSidePanel = ({
  scheduledSessions,
  setScheduledSessions,
  showScheduleSessionCardError,
  
}: SessionSidePanelProps): React.ReactElement => {
  const [showAddSessionView, setShowAddSessionView] = React.useState(false);

  return (
    <Box w="35vw" h="100%" background="background.grey.200" zIndex="10">
      {scheduledSessions.length === 0 || showAddSessionView ? (
        <AddSessionsForm
          scheduledSessions={scheduledSessions}
          setScheduledSessions={setScheduledSessions}
          setShowAddSessions={setShowAddSessionView}
        />
      ) : (
        <CurrentSessionsView
          scheduledSessions={scheduledSessions}
          setScheduledSessions={setScheduledSessions}
          setShowAddSessions={setShowAddSessionView}
          showScheduleSessionCardError={showScheduleSessionCardError}
        />
      )}
    </Box>
  );
};

export default SessionSidePanel;
