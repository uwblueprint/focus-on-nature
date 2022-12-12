import React from "react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Text, VStack } from "@chakra-ui/react";
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
  const setPersonalInfo = usePersonalInfoHook(setCampers);
  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">
        Guelph Summer Camp 2022 Registration
      </Text>
      <Text
        color="#10741A"
        py={7}
        textStyle={{ sm: "xSmallMedium", md: "xSmallBold", lg: "displayLarge" }}
      >
        Camper Information
      </Text>
      <VStack spacing={6} pb={6}>
        {campers.map((camper, index) => (
          <CamperCard
            key={index}
            camper={camper}
            setPersonalInfo={setPersonalInfo}
            camperId={index}
          />
        ))}
      </VStack>

      <Button
        w="100%"
        backgroundColor="primary.green.100"
        color="#ffffff"
        onClick={() =>
          setPersonalInfo({ type: PersonalInfoActions.ADD_CAMPER })
        }
      >
        <SmallAddIcon boxSize={6} />
        <Text pl={3} textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
          Add Another Camper
        </Text>
      </Button>

      <Divider py={4} borderColor="border.secondary.100" />
      <Text
        py={5}
        color="#10741A"
        textStyle={{ sm: "xSmallMedium", md: "xSmallBold", lg: "displayLarge" }}
      >
        Contact Information
      </Text>
      <VStack spacing={6} pb={6}>
        {campers[0].contacts.map((contact, index) => (
          <ContactCard
            key={index}
            contact={contact}
            setPersonalInfo={setPersonalInfo}
            contactId={index}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default PersonalInfo;
