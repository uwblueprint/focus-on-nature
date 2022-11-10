import React from "react";
import { Box } from "@chakra-ui/react";
import { CreateCampSession } from "../../../../types/CampsTypes";
import AddSessionsForm from "./AddSessionsForm";
import CurrentSessionsView from "./CurrentSessionsView";

type SessionSidePanelProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: (sessions: Array<CreateCampSession>) => void;
};

const SessionSidePanel: React.FC<SessionSidePanelProps> = ({
  scheduledSessions,
  setScheduledSessions,
}: SessionSidePanelProps): React.ReactElement => {
  const [showAddSessionView, setShowAddSessionView] = React.useState(false);

  return (
    <Box
      minWidth="35vw"
      minHeight="100vh"
      position="absolute"
      right="0"
      background="background.grey.200"
    >
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
        />
      )}
    </Box>
  );
};

export default SessionSidePanel;
