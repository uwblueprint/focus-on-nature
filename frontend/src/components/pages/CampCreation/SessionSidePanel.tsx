import { Box } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { CreateCampSession } from "../../../types/CampsTypes";
import AddSessionsForm from "./AddSessionsForm";

type SessionSidePanelProps = {
  scheduledSessions: CreateCampSession[];
  setScheduledSessions: Dispatch<SetStateAction<CreateCampSession[]>>;
};

const SessionSidePanel = ({
  scheduledSessions,
  setScheduledSessions,
}: SessionSidePanelProps): JSX.Element => {
  return (
    <Box
      minWidth="35vw"
      minHeight="100vh"
      position="absolute"
      right="0"
      background="background.grey.200"
    >
      <AddSessionsForm
        scheduledSessions={scheduledSessions}
        setScheduledSessions={setScheduledSessions}
      />
    </Box>
  );
};

export default SessionSidePanel;
