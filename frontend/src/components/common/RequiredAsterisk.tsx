import { Text } from "@chakra-ui/react";
import React from "react";

const RequiredAsterisk = (): React.ReactElement => {
  return (
    <Text as="span" color="text.critical.100" verticalAlign="super">
      *
    </Text>
  );
};

export default RequiredAsterisk;
