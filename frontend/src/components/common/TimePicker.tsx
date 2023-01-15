import { Flex } from "@chakra-ui/react";
import React from "react";

type TimePickerProps = {
  isShowingErrors: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// The <Input> element from Chakra did not work in Safari
const TimePicker = ({
  isShowingErrors,
  value,
  onChange,
}: TimePickerProps): React.ReactElement => {
  return (
    <Flex
      direction="row"
      align="center"
      borderColor={isShowingErrors ? "red" : "gray.200"}
      borderWidth={isShowingErrors ? "2px" : "1px"}
      borderRadius="6px"
      width="160px"
      height="52px"
      px={4}
    >
      <input
        type="time"
        placeholder="XX:XX"
        color="transparent"
        style={{ backgroundColor: "inherit", width: "100%" }}
        value={value}
        onChange={onChange}
      />
    </Flex>
  );
};

export default TimePicker;
