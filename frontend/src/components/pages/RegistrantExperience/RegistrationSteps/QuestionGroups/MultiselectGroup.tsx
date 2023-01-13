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
import RequiredAsterisk from "../../../../common/RequiredAsterisk";

type MultiselectGroupProps = {
  formResponses: Map<string, string> | undefined;
  question: FormQuestion;
  handleSelectionChange: (
    selectionsResponse: string,
    question: FormQuestion,
  ) => void;
  nextClicked: boolean;
};

const MultiselectGroup = ({
  formResponses,
  question,
  handleSelectionChange,
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

  const handleSetUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelections = new Set(selections);

    if (e.target.checked) {
      newSelections.add(e.target.value);
    } else {
      newSelections.delete(e.target.value);
    }

    setSelections(newSelections);
    const selectionsResponse = Array.from(newSelections).join(", ");

    handleSelectionChange(selectionsResponse, question);
  };

  return (
    <VStack alignItems="flex-start">
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
            onChange={(e) => handleSetUpdate(e)}
          >
            <Text textStyle={{ sm: "xSmallRegular", lg: "bodyRegular" }}>
              {option}
            </Text>
          </Checkbox>
        ))}
      </VStack>
    </VStack>
  );
};

export default MultiselectGroup;
