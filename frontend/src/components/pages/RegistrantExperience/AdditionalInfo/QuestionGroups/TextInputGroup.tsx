import { FormControl, FormLabel, Text, Textarea } from "@chakra-ui/react";
import React from "react";
import { FormQuestion } from "../../../../../types/CampsTypes";

type TextInputGroupProps = {
  question: FormQuestion;
  updateFormResponse: (key: string, value: string) => void;
};

const TextInputGroup = ({
  question,
  updateFormResponse,
}: TextInputGroupProps): React.ReactElement => {
  return (
    <FormControl isRequired={question.required}>
      <FormLabel fontWeight="bold" fontSize="18px">
        {question.question}
      </FormLabel>
      <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }} mb="3">
        {question.description}
      </Text>
      <Textarea
        placeholder="Type here..."
        backgroundColor="background.white.100"
        onChange={(e) => updateFormResponse(question.question, e.target.value)}
      />
    </FormControl>
  );
};

export default TextInputGroup;
