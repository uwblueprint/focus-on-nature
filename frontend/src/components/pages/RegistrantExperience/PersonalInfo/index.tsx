import React from "react";
import { Box, Checkbox, Text } from "@chakra-ui/react";

type PersonalInfoProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const PersonalInfo = ({
  isChecked,
  toggleChecked,
}: PersonalInfoProps): React.ReactElement => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Registration</Text>
      <Text>Personal Info</Text>

      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={isChecked}
        onChange={toggleChecked}
      />
    </Box>
  );
};

export default PersonalInfo;
