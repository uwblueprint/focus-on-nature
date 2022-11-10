import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { CreateCampSession } from "../../../../types/CampsTypes";
// import SessionsCalendar from "./SessionsCalendar";
import SessionSidePanel from "./SessionSidePanel";

const ScheduleSessionsPage = (): React.ReactElement => {
  const [scheduledSessions, setScheduledSessions] = useState<
    CreateCampSession[]
  >([]);

  return (
    <Box>
      <Text textStyle="displayXLarge">Schedule Sessions</Text>
      <Text textStyle="heading" mb={8}>
        Waterloo Photography Camp 2022 @7:00 AM - 3:00PM
      </Text>
      {/* <SessionsCalendar sessions={scheduledSessions}/> */}
      <SessionSidePanel
        scheduledSessions={scheduledSessions}
        setScheduledSessions={setScheduledSessions}
      />
    </Box>
  );
};

export default ScheduleSessionsPage;
