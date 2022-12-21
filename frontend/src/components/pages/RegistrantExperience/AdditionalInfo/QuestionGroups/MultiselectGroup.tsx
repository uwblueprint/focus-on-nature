import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type MultiselectGroupProps = {
  question: FormQuestion;
  updateFormResponse: (key: string, value: string) => void;
  submitClicked: boolean;
};

const MultiselectGroup = ({
  question,
  updateFormResponse,
  submitClicked,
}: MultiselectGroupProps): React.ReactElement => {
  const [selections, setSelections] = useState<Set<string>>(new Set());

  const invalid = submitClicked && selections.size <= 0 && question.required;

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelections = new Set(selections);
    if (e.target.checked) {
      newSelections.add(e.target.value);
    } else {
      newSelections.delete(e.target.value);
    }
    setSelections(newSelections);

    const selectionsResponse = Array.from(newSelections).join(", ");
    updateFormResponse(question.question, selectionsResponse);
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
      <CheckboxGroup colorScheme="green">
        <VStack alignItems="flex-start">
          {question.options?.map((option, i) => (
            <Checkbox
              key={i}
              size="lg"
              value={option}
              onChange={(e) => handleSelectionChange(e)}
            >
              {option}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </VStack>
  );
};

export default MultiselectGroup;
