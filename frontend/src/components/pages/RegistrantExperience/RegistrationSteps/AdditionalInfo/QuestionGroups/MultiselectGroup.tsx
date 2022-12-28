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
import {
  AdditionalInfoActions,
  AdditionalInfoReducerDispatch,
} from "../../../../../../types/AdditionalInfoTypes";
import { FormQuestion } from "../../../../../../types/CampsTypes";

type MultiselectGroupProps = {
  formResponses: Map<string, string> | undefined;
  camperIndex: number;
  question: FormQuestion;
  dispatchAdditionalInfoAction: (action: AdditionalInfoReducerDispatch) => void;
  submitClicked: boolean;
};

const MultiselectGroup = ({
  formResponses,
  camperIndex,
  question,
  dispatchAdditionalInfoAction,
  submitClicked,
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
    // updateFormResponse(question.question, selectionsResponse);
    dispatchAdditionalInfoAction({
      type: AdditionalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: selectionsResponse,
    });
  };

  console.log("formResponses", formResponses);

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
        {question.options?.map((option, i) => (
          <Checkbox
            key={i}
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
