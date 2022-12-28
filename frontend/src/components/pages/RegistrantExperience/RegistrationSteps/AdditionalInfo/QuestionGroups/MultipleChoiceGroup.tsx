import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  AdditionalInfoActions,
  AdditionalInfoReducerDispatch,
} from "../../../../../../types/AdditionalInfoTypes";
import { FormQuestion } from "../../../../../../types/CampsTypes";

type MultipleChoiceGroupProps = {
  formResponses: Map<string, string> | undefined;
  camperIndex: number;
  question: FormQuestion;
  dispatchAdditionalInfoAction: (action: AdditionalInfoReducerDispatch) => void;
  nextClicked: boolean;
};

const MultipleChoiceGroup = ({
  formResponses,
  camperIndex,
  question,
  dispatchAdditionalInfoAction,
  nextClicked,
}: MultipleChoiceGroupProps): React.ReactElement => {
  const invalid =
    nextClicked && !formResponses?.get(question.question) && question.required;

  const handleMultipleChoiceUpdate = (choice: string) => {
    dispatchAdditionalInfoAction({
      type: AdditionalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: choice,
    });
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
      <RadioGroup
        value={formResponses?.get(question.question)}
        onChange={(choice) => handleMultipleChoiceUpdate(choice)}
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
