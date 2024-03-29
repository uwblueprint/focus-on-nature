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
import RequiredAsterisk from "../../../../common/RequiredAsterisk";

type MultipleChoiceGroupProps = {
  formResponses: Map<string, string> | undefined;
  question: FormQuestion;
  handleMultipleChoiceChange: (choice: string, question: FormQuestion) => void;
  nextClicked: boolean;
  editing?: boolean;
};

const MultipleChoiceGroup = ({
  formResponses,
  question,
  handleMultipleChoiceChange,
  nextClicked,
  editing = false,
}: MultipleChoiceGroupProps): React.ReactElement => {
  let invalid = false;
  if (!editing)
    invalid =
      nextClicked &&
      !formResponses?.get(question.question) &&
      question.required;
  else invalid = !formResponses?.get(question.question) && question.required;

  return (
    <FormControl isInvalid={invalid}>
      <FormLabel>
        <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
          {question.question}{" "}
          {question.required && (
            <Text
              as="span"
              color="text.critical.100"
              fontSize="xs"
              verticalAlign="super"
            >
              <RequiredAsterisk />
            </Text>
          )}
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
        onChange={(choice) => handleMultipleChoiceChange(choice, question)}
      >
        <VStack alignItems="flex-start">
          {question.options?.map((option) => (
            <Radio
              key={`multiple_choice_option_${option}`}
              value={option}
              colorScheme="green"
            >
              <Text textStyle={{ sm: "xSmallRegular", lg: "bodyRegular" }}>
                {option}
              </Text>
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </FormControl>
  );
};

export default MultipleChoiceGroup;
