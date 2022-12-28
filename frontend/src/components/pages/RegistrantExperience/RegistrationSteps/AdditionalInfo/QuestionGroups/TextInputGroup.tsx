import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
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
  nextClicked: boolean;
};

const TextInputGroup = ({
  formResponses,
  camperIndex,
  question,
  dispatchAdditionalInfoAction,
  nextClicked,
}: TextInputGroupProps): React.ReactElement => {
  const invalid =
    nextClicked && !formResponses?.get(question.question) && question.required;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
