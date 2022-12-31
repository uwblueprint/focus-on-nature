import React, { useState } from "react";

import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FormQuestion } from "../../../../../types/CampsTypes";

type MultiselectGroupProps = {
  formResponses: Map<string, string> | undefined;
  question: FormQuestion;
  dispatchFormResponseAction : (selectionsResponse: string, question: FormQuestion ) => void;
  nextClicked: boolean;
};

const MultiselectGroup = ({
  formResponses,
  question,
  dispatchFormResponseAction,
  nextClicked,
}: MultiselectGroupProps): React.ReactElement => {
  const getInitialSelections = (): Set<string> => {
    const questionResponse = formResponses?.get(question.question);
    if (questionResponse) {
      const items = questionResponse.split(", ");
      return new Set(items);
    }
    return new Set();
  };

  const [selections, setSelections] = useState<Set<string>>(
    getInitialSelections(),
  );

  const invalid = nextClicked && selections.size <= 0 && question.required;

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelections = new Set(selections);

    if (e.target.checked) {
      newSelections.add(e.target.value);
    } else {
      newSelections.delete(e.target.value);
    }

    setSelections(newSelections);
    const selectionsResponse = Array.from(newSelections).join(", ");

    dispatchFormResponseAction(selectionsResponse, question);
  };

  return (
    <VStack alignItems="flex-start">
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
      </FormControl>
      <VStack alignItems="flex-start">
        {question.options?.map((option) => (
          <Checkbox
            key={`multiselect_option_${option}`}
            size="lg"
            colorScheme="green"
            value={option}
            isChecked={
              formResponses?.get(question.question)?.includes(option) ?? false
            }
            onChange={(e) => handleSelectionChange(e)}
          >
            {option}
          </Checkbox>
        ))}
      </VStack>
    </VStack>
  );
};

export default MultiselectGroup;
