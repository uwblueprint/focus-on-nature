import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FormQuestion } from "../../../../types/CampsTypes";

type MultipleChoiceGroupProps = {
  question: FormQuestion;
};

const MultipleChoiceGroup = ({
  question,
}: MultipleChoiceGroupProps): React.ReactElement => {
  const [multipleChoiceValue, setMultipleChoiceValue] = useState<string>("0");

  return (
    <FormControl isRequired>
      <FormLabel fontWeight="bold" fontSize="18px">
        {question.question}
      </FormLabel>
      <RadioGroup onChange={setMultipleChoiceValue} value={multipleChoiceValue}>
        <VStack alignItems="flex-start">
          {question.options?.map((option, i) => (
            <Radio key={i} value={`${i}`} colorScheme="green">
              {option}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </FormControl>
  );
};

export default MultipleChoiceGroup;
