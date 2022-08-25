import React from "react";

import { Text, HStack } from "@chakra-ui/react";

const CampersTableFilterTag = ({
  icon,
  description,
  color,
}: {
  icon: any;
  description: string;
  color: string;
}) => {
  return (
    <HStack alignContent="center" color={color}>
      {icon}
      <Text fontWeight="bold">{description}</Text>
    </HStack>
  );
};

export default CampersTableFilterTag;
