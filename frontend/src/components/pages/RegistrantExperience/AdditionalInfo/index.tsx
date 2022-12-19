import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import CamperQuestionsCard from "./QuestionCards/CamperQuestionsCard";
import EarlyDropOffLatePickupCard from "./QuestionCards/EarlyDropOffLatePickupCard";

type AdditionalInfoProps = {
  isChecked: boolean;
  toggleChecked: () => void;
  formQuestions: FormQuestion[];
  campers: RegistrantExperienceCamper[];
  setCampers: (campers: RegistrantExperienceCamper[]) => void;
  campName: string;
  hasEarlyDropOffLatePickup: boolean;
  setRequireEarlyDropOffLatePickup: (
    requireEarlyDropOffLatePickup: boolean,
  ) => void;
};

const AdditionalInfo = ({
  isChecked,
  toggleChecked,
  formQuestions,
  campers,
  setCampers,
  campName,
  hasEarlyDropOffLatePickup,
  setRequireEarlyDropOffLatePickup,
}: AdditionalInfoProps): React.ReactElement => {
  const updateCamperFormResponse = (
    index: number,
    formResponses: Map<string, string>,
  ) => {
    const newCampers = [...campers];
    newCampers[index].formResponses = formResponses;
    setCampers(newCampers);
  };

  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">{`${campName} Registration`}</Text>
      <VStack alignItems="flex-start" spacing={8} marginTop={8}>
        <Text textStyle="displayLarge" textColor="primary.green.100">
          Camper-specific Additional Questions
        </Text>
        {campers.map((camper, index) => (
          <CamperQuestionsCard
            key={index}
            camper={camper}
            formQuestions={formQuestions}
            updateCamperFormResponse={updateCamperFormResponse}
            index={index}
          />
        ))}
        {hasEarlyDropOffLatePickup && (
          <Box width="100%">
            <Divider borderColor="border.secondary.100" mb={6} />
            <Text textStyle="displayLarge" textColor="primary.green.100">
              Camp-specific Additional Questions
            </Text>
            <EarlyDropOffLatePickupCard
              setRequireEarlyDropOffLatePickup={
                setRequireEarlyDropOffLatePickup
              }
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AdditionalInfo;
