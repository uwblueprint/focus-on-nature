import React from "react";
import { Box, Checkbox, Text } from "@chakra-ui/react";

type ReviewRegistrationProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const ReviewRegistration = ({
  isChecked,
  toggleChecked,
}: ReviewRegistrationProps): React.ReactElement => {
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

export default ReviewRegistration;
