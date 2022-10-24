import React, { ChangeEventHandler } from "react";
import { Textarea, FormControl, FormLabel, Text } from "@chakra-ui/react";

type TextAreaWithLabelProps = {
  labelText: string;
  isRequired: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value?: string | number | readonly string[];
};

function TextAreaWithLabel({
  labelText,
  isRequired,
  onChange,
  value,
}: TextAreaWithLabelProps): JSX.Element {
  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>
        <Text fontSize="md" as="b">
          {labelText}
        </Text>
      </FormLabel>
      <Textarea
        minH="120px"
        textAlign="start"
        resize="none"
        onChange={onChange}
        value={value}
      />
    </FormControl>
  );
}

export default TextAreaWithLabel;
