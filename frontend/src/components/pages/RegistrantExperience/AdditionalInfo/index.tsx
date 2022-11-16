import React from "react";
import { Box, Checkbox, Text } from "@chakra-ui/react";

type AdditionalInfoProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const AdditionalInfo = ({
  isChecked,
  toggleChecked,
}: AdditionalInfoProps): React.ReactElement => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Registration</Text>
      <Text>Additional Info</Text>

      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={isChecked}
        onChange={toggleChecked}
      />
    </Box>
  );
};

export default AdditionalInfo;
