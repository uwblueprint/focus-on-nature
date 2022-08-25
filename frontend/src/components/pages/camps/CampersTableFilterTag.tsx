import React from "react";

import { Text, Image, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CampersTableFilterTag = ({
  customIcon,
  icon,
  description,
  color,
}: {
  customIcon: boolean;
  icon: any;
  description: string;
  color: string;
}) => {
  return (
    <HStack alignContent="center" color={color}>
      {customIcon ? (
        <Image src={icon} alt="dropoff icon" display="inline" maxWidth="22px" />
      ) : (
        <FontAwesomeIcon icon={icon} />
      )}
      <Text fontWeight="bold">{description}</Text>
    </HStack>
  );
};

export default CampersTableFilterTag;
