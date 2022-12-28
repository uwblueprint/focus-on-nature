import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  AdditionalInfoActions,
  AdditionalInfoReducerDispatch,
} from "../../../../../../types/AdditionalInfoTypes";
import { FormQuestion } from "../../../../../../types/CampsTypes";

type TextInputGroupProps = {
  formResponses: Map<string, string> | undefined;
  camperIndex: number;
  question: FormQuestion;
  dispatchAdditionalInfoAction: (action: AdditionalInfoReducerDispatch) => void;
  submitClicked: boolean;
};

const TextInputGroup = ({
  formResponses,
  camperIndex,
  question,
  dispatchAdditionalInfoAction,
  submitClicked,
}: TextInputGroupProps): React.ReactElement => {
  const [inputText, setInputText] = useState("");

  const invalid = submitClicked && inputText === "" && question.required;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    console.log("hihi");

    // updateFormResponse(question.question, e.target.value);
    dispatchAdditionalInfoAction({
      type: AdditionalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: e.target.value,
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
      <Textarea
        value={formResponses?.get(question.question) ?? ""}
        placeholder="Type here..."
        backgroundColor="background.white.100"
        onChange={(e) => handleInputChange(e)}
      />
    </FormControl>
  );
};

export default TextInputGroup;
