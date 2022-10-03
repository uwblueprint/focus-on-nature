import { Container, Button, Text } from "@chakra-ui/react";
import React from "react";

import CamperAPIClient from "../../APIClients/CamperAPIClient";
import { Camper } from "../../types/CamperTypes";

const campers: Camper[] = [
  {
    campSession: "63139cdec3d7b55b44a01541",
    firstName: "test",
    lastName: "test",
    age: 12,
    allergies: "",
    earlyDropoff: [new Date("2022-04-06T00:00:00.000+00:00")],
    latePickup: [new Date("2022-04-06T00:00:00.000+00:00")],
    // latePickup: [],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mommy",
        lastName: "?",
        email: "mommyyy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "mommy",
      },
      {
        firstName: "Daddy",
        lastName: "?",
        email: "daddy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "daddy",
      },
    ],
    registrationDate: new Date("2022-04-06T00:00:00.000+00:00"),
    hasPaid: false,
    // formResponses: "622cfedaaf70bf090031d064","five",
    chargeId: "hi",
    charges: {
      camp: 20,
      earlyDropoff: 0,
      latePickup: 0,
    },
    optionalClauses: [
      {
        clause: "",
        agreed: true,
      },
    ],
  },
  {
    campSession: "63139cdec3d7b55b44a01541",
    firstName: "test2",
    lastName: "test2",
    age: 12,
    allergies: "",
    // earlyDropoff: [new Date("2022-04-06T00:00:00.000+00:00")],
    earlyDropoff: [],
    latePickup: [new Date("2022-04-06T00:00:00.000+00:00")],
    // latePickup: [],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mommy",
        lastName: "?",
        email: "mommyyy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "mommy",
      },
      {
        firstName: "Daddy",
        lastName: "?",
        email: "daddy@gmail.com",
        phoneNumber: "1234",
        relationshipToCamper: "daddy",
      },
    ],
    registrationDate: new Date("2022-04-06T00:00:00.000+00:00"),
    hasPaid: false,
    // formResponses: "622cfedaaf70bf090031d064","five",
    chargeId: "hi",
    charges: {
      camp: 20,
      earlyDropoff: 0,
      latePickup: 0,
    },
    optionalClauses: [
      {
        clause: "",
        agreed: true,
      },
    ],
  },
];

function thing(): void {
  CamperAPIClient.registerCampers(campers);
}

const ProductDisplay = () => (
  <Container>
    <Button onClick={thing}>
      <Text>click here</Text>
    </Button>
  </Container>
);

const GlobalFormsPage = (): React.ReactElement => {
  return (
    <div>
      <ProductDisplay />
    </div>
  );
};

export default GlobalFormsPage;
