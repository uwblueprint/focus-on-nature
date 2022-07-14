import { Flex } from "@chakra-ui/react";
import React from "react";
import CampSessionInfoHeader from "../common/camps/CampSessionInfoHeader";

const CampsPage = (): React.ReactElement => {
  // sample data
  const camp = {
    ageLower: 9,
    ageUpeer: 12,
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
    <div>
      <h2>Camps Page</h2>
      <Flex margin="10px">
        <CampSessionInfoHeader camp={camp} />
      </Flex>
    </div>
  );
};

export default CampsPage;
