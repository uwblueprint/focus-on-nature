import React from "react";
import { Text } from "@chakra-ui/react";

const RequiredTag = (): React.ReactElement => {
  return (
    <Text
      borderRadius="50px"
      px={4}
      bg="background.required.100"
      color="text.critical.100"
    >
      required
    </Text>
  );
};

export default RequiredTag;
