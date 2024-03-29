import React from "react";
import { Text } from "@chakra-ui/react";

const RequiredAsterisk = (): React.ReactElement => {
  return (
    <Text
      as="span"
      color="text.critical.100"
      fontSize="xs"
      verticalAlign="super"
    >
      *
    </Text>
  );
};

export default RequiredAsterisk;
