import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import QuestionsCard from "./QuestionsCard";

type AdditionalInfoProps = {
  isChecked: boolean;
  toggleChecked: () => void;
  formQuestions: FormQuestion[];
  campers: RegistrantExperienceCamper[];
  setCampers: (campers: RegistrantExperienceCamper[]) => void;
  campName: string;
};

const AdditionalInfo = ({
  isChecked,
  toggleChecked,
  formQuestions,
  campers,
  setCampers,
  campName,
}: AdditionalInfoProps): React.ReactElement => {
  const updateCampers = (index: number, formResponses: Map<string, string>) => {
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
          <QuestionsCard
            key={index}
            camper={camper}
            formQuestions={formQuestions}
            updateCampers={updateCampers}
            index={index}
          />
        ))}
        <Divider borderColor="border.secondary.100" />
        <Text textStyle="displayLarge" textColor="primary.green.100">
          Camp-specific Additional Questions
        </Text>
      </VStack>
    </Box>
  );
};

export default AdditionalInfo;
