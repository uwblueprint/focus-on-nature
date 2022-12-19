import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type MultipleChoiceGroupProps = {
  question: FormQuestion;
  updateFormResponse: (key: string, value: string) => void;
};

const MultipleChoiceGroup = ({
  question,
  updateFormResponse,
}: MultipleChoiceGroupProps): React.ReactElement => {
  const multipleChoiceState = useState<string>("");
  const setMultipleChoice = multipleChoiceState[1];

  const handleMultipleChoiceUpdate = (choice: string) => {
    setMultipleChoice(choice);
    updateFormResponse(question.question, choice);
  };

  return (
    <FormControl isRequired={question.required}>
      <FormLabel fontWeight="bold" fontSize="18px">
        {question.question}
      </FormLabel>
      <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }} mb="3">
        {question.description}
      </Text>
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
