import { Box } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { CreateCampSession } from "../../../../types/CampsTypes";
import AddSessionsForm from "./AddSessionsForm";
import CurrentSessionsView from "./CurrentSessionsView";

type SessionSidePanelProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: Dispatch<SetStateAction<CreateCampSession[]>>;
};

const SessionSidePanel = ({
  scheduledSessions,
  setScheduledSessions,
}: SessionSidePanelProps): JSX.Element => {
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
