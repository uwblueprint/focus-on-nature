import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type MultiselectGroupProps = {
  question: FormQuestion;
  updateFormResponse: (key: string, value: string) => void;
};

const MultiselectGroup = ({
  question,
  updateFormResponse,
}: MultiselectGroupProps): React.ReactElement => {
  const [selections, setSelections] = useState<Set<string>>(new Set());

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
    <FormControl isRequired={question.required}>
      <FormLabel fontWeight="bold" fontSize="18px">
        {question.question}
      </FormLabel>
      <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }} mb="3">
        {question.description}
      </Text>
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
    </FormControl>
  );
};

export default MultiselectGroup;
