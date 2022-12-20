import React from "react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Text, useToast, VStack } from "@chakra-ui/react";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { usePersonalInfoHook } from "./personalInfoReducer";
import CamperCard from "./CamperCard";
import { PersonalInfoActions } from "../../../../types/PersonalInfoTypes";
import ContactCard from "./ContactCard";
import { CampSession } from "../../../../types/CampsTypes";

type PersonalInfoProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  campers: RegistrantExperienceCamper[];
  campName: string;
  campSessions: CampSession[];
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
};

const checkSpaceAvailable = (
  campSessions: CampSession[],
  campers: RegistrantExperienceCamper[],
): boolean => {
  // validate whether there is enough space for a new camper
  let spaceAvailable = 100000000;
  /* eslint-disable-next-line */
  for (const campSession of campSessions) spaceAvailable = Math.min(spaceAvailable,campSession.capacity - campSession.campers.length - campers.length);
  return spaceAvailable > 0;
};

const PersonalInfo = ({
  nextBtnRef,
  campers,
  campName,
  campSessions,
  setCampers,
}: PersonalInfoProps): React.ReactElement => {
  const toast = useToast();
  const setPersonalInfo = usePersonalInfoHook(setCampers);
  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">{campName} Registration</Text>
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
            nextBtnRef={nextBtnRef}
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
        onClick={() => {
          if (checkSpaceAvailable(campSessions, campers))
            setPersonalInfo({
              type: PersonalInfoActions.ADD_CAMPER,
              campSessions,
            });
          else
            toast({
              title: "Max Capacity Reached",
              description: "Camp is currently full",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
        }}
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
            nextBtnRef={nextBtnRef}
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
