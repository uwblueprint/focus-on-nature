import { Checkbox, FormControl, FormLabel, VStack } from "@chakra-ui/react";
import React from "react";
import { FormQuestion } from "../../../../types/CampsTypes";

type MultiselectGroupProps = {
  question: FormQuestion;
};

const MultiselectGroup = ({
  question,
}: MultiselectGroupProps): React.ReactElement => {
  return (
    <FormControl isRequired>
      <FormLabel fontWeight="bold" fontSize="18px">
        {question.question}
      </FormLabel>
      <VStack alignItems="flex-start">
        {question.options?.map((option, i) => (
          <Checkbox key={i} size="lg" colorScheme="green">
            {option}
          </Checkbox>
        ))}
      </VStack>
    </FormControl>
  );
};

export default MultiselectGroup;
