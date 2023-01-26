import React from "react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Text, VStack } from "@chakra-ui/react";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import ContactCard from "./ContactCard";
import { usePersonalInfoDispatcher } from "./personalInfoReducer";
import { CampResponse, CampSession } from "../../../../../types/CampsTypes";
import { PersonalInfoActions } from "../../../../../types/PersonalInfoTypes";
import CamperCard from "./CamperCard";

type PersonalInfoProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  campers: RegistrantExperienceCamper[];
  campSessions: CampSession[];
  camp: CampResponse;
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
  isWaitlistRegistration?: boolean;
};

const checkSpaceAvailable = (
  campSessions: CampSession[],
  campers: RegistrantExperienceCamper[],
): boolean => {
  // validate whether there is enough space for a new camper
  const spaceAvailable: number = campSessions.reduce(
    (minSpaceAvailable, currentSession) => {
      return Math.min(
        minSpaceAvailable,
        currentSession.capacity -
          currentSession.campers.length -
          campers.length,
      );
    },
    Number.MAX_SAFE_INTEGER,
  );
  return spaceAvailable > 0;
};

const PersonalInfo = ({
  nextBtnRef,
  campers,
  campSessions,
  camp,
  setCampers,
  isWaitlistRegistration,
}: PersonalInfoProps): React.ReactElement => {
  const dispatchPersonalInfoAction = usePersonalInfoDispatcher(setCampers);

  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">{camp.name} Registration</Text>
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
            dispatchPersonalInfoAction={dispatchPersonalInfoAction}
            camperIndex={index}
            camp={camp}
            personalInfoQuestions={camp.formQuestions.filter(
              (q) => q.category === "PersonalInfo",
            )}
          />
        ))}
      </VStack>

      {!isWaitlistRegistration && (
        <Button
          w="100%"
          backgroundColor="primary.green.100"
          color="#ffffff"
          isDisabled={!checkSpaceAvailable(campSessions, campers)}
          onClick={() => {
            dispatchPersonalInfoAction({
              type: PersonalInfoActions.ADD_CAMPER,
            });
          }}
        >
          <SmallAddIcon boxSize={6} />
          <Text pl={3} textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
            Add Another Camper
          </Text>
        </Button>
      )}

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
            camper={campers[0]}
            dispatchPersonalInfoAction={dispatchPersonalInfoAction}
            contactIndex={index}
            emergencyContactQuestions={camp.formQuestions.filter(
              (q) => q.category === "EmergencyContact",
            )}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default PersonalInfo;
