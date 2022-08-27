import { Box, Container } from "@chakra-ui/react";
import React from "react";
import CampSessionInfoHeader from "../common/camps/CampSessionInfoHeader";
import CampersTableNavBar from "./camps/CampersTableNavBar";

const CampsPage = (): React.ReactElement => {
  // sample data
  const camp = {
    ageLower: 9,
    ageUpper: 12,
    startTime: "12:30",
    endTime: "3:00",
    campSessions: [
      {
        capacity: 30,
        dates: [
          new Date("2022-05-01T00:00:00.000+00:00"),
          new Date("2022-06-01T00:00:00.000+00:00"),
        ],
      },
      {
        capacity: 20,
        dates: [
          new Date("2022-06-01T00:00:00.000+00:00"),
          new Date("2022-07-01T00:00:00.000+00:00"),
        ],
      },
      {
        capacity: 25,
        dates: [
          new Date("2022-07-01T00:00:00.000+00:00"),
          new Date("2022-08-01T00:00:00.000+00:00"),
        ],
      },
      {
        capacity: 35,
        dates: [
          new Date("2022-08-01T00:00:00.000+00:00"),
          new Date("2022-09-01T00:00:00.000+00:00"),
        ],
      },
    ],
  };

  return (
    <Box backgroundColor="grey.200">
      <Container maxW="90vw" width="100%" my="20px">
        <CampSessionInfoHeader camp={camp} />
      </Container>
      <CampersTableNavBar />
    </Box>
  );
};

export default CampsPage;
