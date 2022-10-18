import React from "react";

import {
  VStack,
  RadioGroup,
  Stack,
  Radio,
  Textarea,
  CheckboxGroup,
  Checkbox,
  FormLabel,
  FormControl,
  Text,
} from "@chakra-ui/react";
import { FormQuestion } from "../../../../types/CampsTypes";

const EditCamperFormResponseSection = ({
  formQuestions,
  camperResponses,
  setFormResponses,
}: {
  formQuestions: FormQuestion[];
  camperResponses: Map<string, string>;
  setFormResponses: (formResponses: Map<string, string> | undefined) => void;
}): JSX.Element => {
  const updateFormResponse = (question: string, option: string) => {
    const newCamperResponse = new Map(Object.entries(camperResponses));
    newCamperResponse.set(question, option);
    setFormResponses(newCamperResponse);
  };

  const renderMCQ = (
    question: string,
    answer: string | undefined,
    options: string[],
    questionId: string,
    isRequired: boolean,
  ) => {
    return (
      <FormControl key={questionId} isRequired={isRequired}>
        <FormLabel>
          <Text fontSize="md" as="b">
            {question}
          </Text>
        </FormLabel>
        <RadioGroup defaultValue={answer} pb="18px">
          <Stack direction="column">
            {options.map((option) => (
              <Radio
                key={`${questionId}_${option}`}
                value={option}
                onChange={() => {
                  updateFormResponse(question, option);
                }}
              >
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
    );
  };

  const renderText = (
    question: string,
    answer: string,
    questionId: string,
    isRequired: boolean,
  ) => {
    return (
      <FormControl key={questionId} minW="100%" isRequired={isRequired}>
        <FormLabel>
          <Text fontSize="md" as="b">
            {question}
          </Text>
        </FormLabel>
        <Textarea
          resize="none"
          minH="120px"
          textAlign="start"
          defaultValue={answer}
          onChange={(event) => {
            updateFormResponse(question, event.target.value);
          }}
          pb="18px"
        />
      </FormControl>
    );
  };

  const renderMultiSelect = (
    question: string,
    answer: string | undefined,
    options: string[],
    questionId: string,
    isRequired: boolean,
  ) => {
    const answeredOptions = answer?.split(",");

    return (
      <FormControl key={questionId} isRequired={isRequired} pb="18px">
        <FormLabel>
          <Text fontSize="md" as="b">
            {question}
          </Text>
        </FormLabel>
        <CheckboxGroup
          defaultValue={answeredOptions}
          onChange={(newAnswers) => {
            const newAnswer = newAnswers.join(",");
            updateFormResponse(question, newAnswer);
          }}
        >
          <Stack direction="column">
            {options.map((option) => (
              <Checkbox key={`${questionId}_${option}`} value={option}>
                {option}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    );
  };

  return (
    <VStack align="start">
      {formQuestions.map((formQuestion) => {
        const { question, type } = formQuestion;
        const camperAnswerIndex = Object.keys(camperResponses).indexOf(
          question,
        );
        const camperAnswer =
          camperAnswerIndex !== -1
            ? Object.values(camperResponses)[camperAnswerIndex]
            : "";

        switch (type) {
          case "MultipleChoice":
            return formQuestion.options
              ? renderMCQ(
                  question,
                  camperAnswer,
                  formQuestion.options,
                  formQuestion.id,
                  formQuestion.required,
                )
              : null;
          case "Multiselect":
            return formQuestion.options
              ? renderMultiSelect(
                  question,
                  camperAnswer,
                  formQuestion.options,
                  formQuestion.id,
                  formQuestion.required,
                )
              : null;
          case "Text":
            return renderText(
              question,
              camperAnswer,
              formQuestion.id,
              formQuestion.required,
            );
          default:
            return null;
        }
      })}
    </VStack>
  );
};

export default EditCamperFormResponseSection;
