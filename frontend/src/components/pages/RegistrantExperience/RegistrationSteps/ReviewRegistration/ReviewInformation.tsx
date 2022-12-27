import { Box, Checkbox, Text } from "@chakra-ui/react";
import React from "react";

type ReviewInformationProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const ReviewInformation = ({
  isChecked,
  toggleChecked,
}: ReviewInformationProps): React.ReactElement => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Registration</Text>
      <Text>Review Registration</Text>

      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={isChecked}
        onChange={toggleChecked}
      />
    </Box>
  );
};

export default ReviewInformation;
