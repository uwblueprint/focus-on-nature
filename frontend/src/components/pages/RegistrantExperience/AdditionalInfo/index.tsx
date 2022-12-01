import React from "react";
import { Box, Checkbox, Flex, Text, VStack } from "@chakra-ui/react";
import { FormQuestion } from "../../../../types/CampsTypes";
import { Camper } from "../../../../types/CamperTypes";

type AdditionalInfoProps = {
  isChecked: boolean;
  toggleChecked: () => void;
  formQuestions: FormQuestion[];
  personalInfo: Camper[];
};

const AdditionalInfo = ({
  isChecked,
  toggleChecked,
  formQuestions,
  personalInfo,
}: AdditionalInfoProps): React.ReactElement => {
  return (
    <VStack alignItems="flex-start" spacing={8} marginTop={8}>
      <Text textStyle="displayLarge" textColor="primary.green.100">
        Camper-specific Additional Questions
      </Text>
      {personalInfo.map((camper) => (
        <Flex
          key={camper.lastName}
          backgroundColor="background.white.100"
          marginY={10}
          width="100%"
          borderRadius={10}
          wrap="wrap"
          padding={10}
        >
          <Text>Additional Info</Text>
          {formQuestions.map((question) => (
            <Text key={question.id}>{question.question}</Text>
          ))}
          <Checkbox
            size="lg"
            borderColor="black"
            isChecked={isChecked}
            onChange={toggleChecked}
          />
        </Flex>
      ))}
    </VStack>
  );
};

export default AdditionalInfo;
