import React from "react";
import { Box, Checkbox, Text } from "@chakra-ui/react";

type WaiverProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const Waiver = ({
  isChecked,
  toggleChecked,
}: WaiverProps): React.ReactElement => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Registration</Text>
      <Text>Waiver</Text>

      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={isChecked}
        onChange={toggleChecked}
      />
    </Box>
  );
};

export default Waiver;
