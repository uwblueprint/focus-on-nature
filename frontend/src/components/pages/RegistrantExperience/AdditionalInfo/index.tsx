import React from "react";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
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
          backgroundColor="background.grey.200"
          marginY={10}
          width="100%"
          borderRadius={10}
          wrap="wrap"
          dropShadow="dark-lg"
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
                      {question.description}
                    </FormLabel>
                    <Input type="text" />
                  </FormControl>
                )}
                {question.type === "Multiselect" && (
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold" fontSize="18px">
                      {question.description}
                    </FormLabel>
                    <Checkbox size="lg" />
                  </FormControl>
                )}
                {question.type === "MultipleChoice" && (
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold" fontSize="18px">
                      {question.description}
                    </FormLabel>
                    <Radio value="thing">thing</Radio>
                  </FormControl>
                )}
              </Flex>
            ))}
          </VStack>
        </Flex>
      ))}
    </VStack>
  );
};

export default AdditionalInfo;
