import React from "react";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { FormQuestion } from "../../../../../types/CampsTypes";
import RequiredAsterisk from "../../../../common/RequiredAsterisk";

type TextInputGroupProps = {
  formResponses: Map<string, string> | undefined;
  question: FormQuestion;
  handleTextChange: (response: string, question: FormQuestion) => void;
  nextClicked: boolean;
};

const TextInputGroup = ({
  formResponses,
  question,
  handleTextChange,
  nextClicked,
}: TextInputGroupProps): React.ReactElement => {
  const invalid =
    nextClicked && !formResponses?.get(question.question) && question.required;

  return (
    <FormControl isInvalid={invalid}>
      <FormLabel>
        <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
          {question.question}{" "}
          
          {question.required && 
          <Text
            as="span"
            color="text.critical.100"
            fontSize="xs"
            verticalAlign="super"
          >
            <RequiredAsterisk />
          </Text>
          }

        </Text>
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
        textStyle={{ sm: "xSmallRegular", lg: "bodyRegular" }}
        backgroundColor="background.white.100"
        onChange={(e) => handleTextChange(e.target.value, question)}
      />
    </FormControl>
  );
};

export default TextInputGroup;
