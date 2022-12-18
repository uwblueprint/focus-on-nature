import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import MultipleChoiceGroup from "./MultipleChoiceGroup";
import MultiselectGroup from "./MultiselectGroup";

type AdditionalInfoProps = {
  isChecked: boolean;
  toggleChecked: () => void;
  formQuestions: FormQuestion[];
  personalInfo: RegistrantExperienceCamper[];
  campName: string;
};

const AdditionalInfo = ({
  isChecked,
  toggleChecked,
  formQuestions,
  personalInfo,
  campName,
}: AdditionalInfoProps): React.ReactElement => {
  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">{`${campName} Registration`}</Text>
      <VStack alignItems="flex-start" spacing={8} marginTop={8}>
        <Text textStyle="displayLarge" textColor="primary.green.100">
          Camper-specific Additional Questions
        </Text>
        {personalInfo.map((camper, index) => (
          <Box
            key={index}
            width="100%"
            backgroundColor="background.grey.200"
            marginY={10}
            boxShadow="lg"
            rounded="xl"
            borderWidth={1}
            paddingBottom={5}
          >
            <VStack width="100%" alignItems="flex-start">
              <Flex
                width="100%"
                backgroundColor="background.white.100"
                borderTopRadius={10}
                padding={5}
              >
                <Text textStyle="displaySmallSemiBold">{`${camper.firstName} ${camper.lastName}`}</Text>
              </Flex>
              {formQuestions.map((question) => (
                <Flex key={question.id} width="100%" padding={5}>
                  {question.type === "Text" && (
                    <FormControl isRequired>
                      <FormLabel fontWeight="bold" fontSize="18px">
                        {question.question}
                      </FormLabel>
                      <Input type="text" />
                    </FormControl>
                  )}
                  {question.type === "Multiselect" && (
                    <MultiselectGroup question={question} />
                  )}
                  {question.type === "MultipleChoice" && (
                    <MultipleChoiceGroup question={question} />
                  )}
                </Flex>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default AdditionalInfo;
