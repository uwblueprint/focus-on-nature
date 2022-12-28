import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type MultipleChoiceGroupProps = {
  camperFormResponses?: Map<string, string>;
  question: FormQuestion;
  updateFormResponse: (key: string, value: string) => void;
  submitClicked: boolean;
};

const MultipleChoiceGroup = ({
  camperFormResponses,
  question,
  updateFormResponse,
  submitClicked,
}: MultipleChoiceGroupProps): React.ReactElement => {
  const [multipleChoice, setMultipleChoice] = useState("");

  const invalid = submitClicked && multipleChoice === "" && question.required;

  const handleMultipleChoiceUpdate = (choice: string) => {
    setMultipleChoice(choice);
    updateFormResponse(question.question, choice);
  };

  return (
    <FormControl isRequired={question.required} isInvalid={invalid}>
      <FormLabel fontWeight="bold" fontSize="18px">
        {question.question}
      </FormLabel>
      <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }} mb="3">
        {question.description}
      </Text>
      {invalid && (
        <FormErrorMessage>Please fill out this question.</FormErrorMessage>
      )}
      <RadioGroup onChange={(choice) => handleMultipleChoiceUpdate(choice)}>
        <VStack alignItems="flex-start">
          {question.options?.map((option, i) => (
            <Radio key={i} value={option} colorScheme="green">
              {option}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </FormControl>
  );
};

export default MultipleChoiceGroup;
