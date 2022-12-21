import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type MultipleChoiceGroupProps = {
  question: FormQuestion;
  updateFormResponse: (key: string, value: string) => void;
  submitClicked: boolean;
  setFormHasError: (formHasError: boolean) => void;
};

const MultipleChoiceGroup = ({
  question,
  updateFormResponse,
  submitClicked,
  setFormHasError,
}: MultipleChoiceGroupProps): React.ReactElement => {
  const [choice, setChoice] = useState("");

  const invalid = submitClicked && choice === "" && question.required;

  const handleMultipleChoiceUpdate = (e: string) => {
    setChoice(e);

    setFormHasError(invalid);

    updateFormResponse(question.question, e);
  };

  console.log(`mc: ${choice === ""}`);

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
      <RadioGroup onChange={(e) => handleMultipleChoiceUpdate(e)}>
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
