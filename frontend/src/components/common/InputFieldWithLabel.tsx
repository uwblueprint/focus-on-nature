import React from "react";

import { VStack, Input, FormControl, FormLabel, Text } from "@chakra-ui/react";

type InputFieldWithLabelProps = {
  labelText: string;
  isRequired: boolean;
  isInvalid: boolean;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | number | readonly string[];
};

function InputFieldWithLabel({
  labelText,
  isInvalid,
  isRequired,
  onInputChange,
  value,
}: InputFieldWithLabelProps): JSX.Element {
  return (
    <VStack align="start" flexGrow="1">
      <FormControl isRequired={isRequired} isInvalid={isInvalid}>
        <FormLabel>
          <Text fontSize="md" as="b">
            {labelText}
          </Text>
        </FormLabel>
        <Input onChange={onInputChange} value={value} />
      </FormControl>
    </VStack>
  );
}

export default InputFieldWithLabel;
