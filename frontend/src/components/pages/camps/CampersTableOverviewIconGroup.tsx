import React from "react";

import { Text, Image, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faHandDots,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";

import icon_sunrise from "../../../assets/icon_sunrise.svg";
import icon_sunset from "../../../assets/icon_sunset.svg";

import { Camper } from "../../../types/CamperTypes";

const TableOverviewIcon = ({
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
    <HStack
      alignContent="center"
      background="background.white.100"
      border="1px"
      borderColor="background.grey.400"
      px="3"
      py="1"
      borderRadius="20"
      color={color}
    >
      {customIcon ? (
        <Image src={icon} alt="dropoff icon" display="inline" maxWidth="22px" />
      ) : (
        <FontAwesomeIcon icon={icon} />
      )}
      <Text fontWeight="bold">{description}</Text>
    </HStack>
  );
};

const CampersTableOverviewIconGroup = ({
  campers,
  campCapacity,
  camperDetailsCount,
}: {
  campers: Camper[];
  campCapacity: number;
  camperDetailsCount: { [key: string]: number };
}) => {
  return (
    <HStack>
      <TableOverviewIcon
        customIcon={false}
        icon={faPerson}
        description={campers.length
          .toString()
          .concat("/")
          .concat(campCapacity.toString())}
        color="text.critical.100"
      />
      {camperDetailsCount.earlyDropoff && (
        <TableOverviewIcon
          customIcon
          icon={icon_sunset}
          description={camperDetailsCount.earlyDropoff.toString()}
          color="text.default.100"
        />
      )}
      {camperDetailsCount.latePickup && (
        <TableOverviewIcon
          customIcon
          icon={icon_sunrise}
          description={camperDetailsCount.latePickup.toString()}
          color="text.default.100"
        />
      )}
      {camperDetailsCount.allergies && (
        <TableOverviewIcon
          customIcon={false}
          icon={faHandDots}
          description={camperDetailsCount.allergies.toString()}
          color="text.default.100"
        />
      )}
      {camperDetailsCount.specialNeeds && (
        <TableOverviewIcon
          customIcon={false}
          icon={faHandshakeAngle}
          description={camperDetailsCount.specialNeeds.toString()}
          color="text.default.100"
        />
      )}
    </HStack>
  );
};

export default CampersTableOverviewIconGroup;
