import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type TextInputGroupProps = {
  question: FormQuestion;
  updateFormResponse: (key: string, value: string) => void;
  submitClicked: boolean;
  setFormHasError: (formHasError: boolean) => void;
};

const TextInputGroup = ({
  question,
  updateFormResponse,
  submitClicked,
  setFormHasError,
}: TextInputGroupProps): React.ReactElement => {
  const [inputText, setInputText] = useState("");

  const invalid = submitClicked && inputText === "" && question.required;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    setFormHasError(invalid);

    updateFormResponse(question.question, e.target.value);
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
      <Textarea
        placeholder="Type here..."
        backgroundColor="background.white.100"
        onChange={(e) => handleInputChange(e)}
      />
    </FormControl>
  );
};

export default TextInputGroup;
