import React, { useContext } from "react";
import { Flex } from "@chakra-ui/react";
import WaitlistedCampersTable from "./CampOverview/WaitlistedCampersTable";
import CampSessionInfoHeader from "../common/camps/CampSessionInfoHeader";

const waitlistedCampers = [
  {
    firstName: "Joe",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Smith",
    contactEmail: "mom@domain.com",
    contactNumber: "000-123-4567",
    status: "RegistrationFormSent",
    linkExpiry: "2022-07-28T19:12:31.783+00:00",
  },
  {
    firstName: "Bob",
    lastName: "Bobby",
    age: 13,
    contactName: "Mom Bob",
    contactEmail: "bobmom@domain.com",
    contactNumber: "000-123-4568",
    status: "NotRegistered",
    linkExpiry: "2022-08-19T19:12:31.783+00:00",
  },
  {
    firstName: "Joe",
    lastName: "Bob",
    age: 12,
    contactName: "Mom JoeBob",
    contactEmail: "joebobmom@domain.com",
    contactNumber: "000-123-4569",
    status: "Registered",
  },
  {
    firstName: "Dan",
    lastName: "Smith",
    age: 11,
    contactName: "Mom Dan",
    contactEmail: "danmom@domain.com",
    contactNumber: "000-123-4560",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Jane",
    contactEmail: "janemom@domain.com",
    contactNumber: "000-123-4561",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
  {
    firstName: "Ella",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Ella",
    contactEmail: "ellamom@domain.com",
    contactNumber: "000-123-4562",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
  {
    firstName: "Sarah",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Sarah",
    contactEmail: "sarahmom@domain.com",
    contactNumber: "000-123-4565",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
];

const emptything = null;

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
    <div>
      <h2>Camps Page</h2>
      <Flex margin="10px">
        <CampSessionInfoHeader camp={camp} />
      </Flex>
      <WaitlistedCampersTable waitlistedCampers={waitlistedCampers} />
    </div>
  );
};

export default CampsPage;
