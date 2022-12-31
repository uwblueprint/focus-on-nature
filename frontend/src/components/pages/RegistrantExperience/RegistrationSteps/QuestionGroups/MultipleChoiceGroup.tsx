import React from "react";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type MultipleChoiceGroupProps = {
  formResponses: Map<string, string> | undefined;
  question: FormQuestion;
  handleMultipleChoiceUpdate: (choice: string, question: FormQuestion) => void;
  nextClicked: boolean;
};

const MultipleChoiceGroup = ({
  formResponses,
  question,
  handleMultipleChoiceUpdate,
  nextClicked,
}: MultipleChoiceGroupProps): React.ReactElement => {
  const invalid =
    nextClicked && !formResponses?.get(question.question) && question.required;

  return (
    <FormControl isRequired={question.required} isInvalid={invalid}>
      <FormLabel>
        <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
          {question.question}
        </Text>
      </FormLabel>
      <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }} mb="3">
        {question.description}
      </Text>
      {invalid && (
        <FormErrorMessage>Please fill out this question.</FormErrorMessage>
      )}
      <RadioGroup
        value={formResponses?.get(question.question)}
        onChange={(choice) => handleMultipleChoiceUpdate(choice, question)}
      >
        <VStack alignItems="flex-start">
          {question.options?.map((option) => (
            <Radio
              key={`multiple_choice_option_${option}`}
              value={option}
              colorScheme="green"
            >
              {option}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </FormControl>
  );
};

export default MultipleChoiceGroup;
