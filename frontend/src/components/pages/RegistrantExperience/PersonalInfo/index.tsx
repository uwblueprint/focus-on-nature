import React, { useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Camper } from "../../../../types/CamperTypes";
import { usePersonalInfoHook } from "./personalInfoReducer";
import CamperCard from "./CamperCard";
import { PersonalInfoActions } from "../../../../types/PersonalInfoTypes";
import ContactCard from "./ContactCard";

type PersonalInfoProps = {
  campers: Camper[];
  setCampers: React.Dispatch<React.SetStateAction<Camper[]>>;
};

const PersonalInfo = ({
  campers,
  setCampers,
}: PersonalInfoProps): React.ReactElement => {
  console.log(campers);
  const setPersonalInfo = usePersonalInfoHook(setCampers);
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Registration</Text>
      <Text>Personal Info</Text>
      {campers.map((camper, index) => (
        <CamperCard
          key={index}
          camper={camper}
          setPersonalInfo={setPersonalInfo}
          camperId={index}
        />
      ))}

      <Button
        onClick={() =>
          setPersonalInfo({ type: PersonalInfoActions.ADD_CAMPER })
        }
      >
        Add New Camper
      </Button>
      {campers[0].contacts.map((contact, index) => (
        <ContactCard
          key={index}
          contact={contact}
          setPersonalInfo={setPersonalInfo}
          contactId={index}
        />
      ))}
    </Box>
  );
};

export default PersonalInfo;
