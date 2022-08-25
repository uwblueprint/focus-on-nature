import React from "react";

import { Container, Text, HStack } from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandDots,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";

import { ReactComponent as PickupIcon } from "../../../assets/icon_custom_sunrise.svg";
import { ReactComponent as SunriseIcon } from "../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../assets/icon_sunset.svg";

import { Camper } from "../../../types/CamperTypes";

const CamperDetailsBadge = ({
  icon,
  description,
  color,
}: {
  icon: any;
  description: string;
  color: string;
}) => {
  return (
    <HStack
      alignContent="center"
      background={color}
      px="5"
      py="2"
      borderRadius="5"
    >
      {icon}
      <Text>{description}</Text>
    </HStack>
  );
};

const CamperDetailsBadgeGroup = ({ camper }: { camper: Camper }) => {
  return (
    <Container width="-webkit-fit-content" marginStart="0px">
      <HStack>
        {camper.latePickup && camper.earlyDropoff && (
          <CamperDetailsBadge
            icon={<PickupIcon />}
            description="pick-up & drop-off"
            color="camperDetailsCards.latePickupAndEarlyDropOff"
          />
        )}
        {camper.latePickup && !camper.earlyDropoff && (
          <CamperDetailsBadge
            icon={<SunriseIcon fill="black" />}
            description="late pick-up"
            color="camperDetailsCards.latePickup"
          />
        )}
        {!camper.latePickup && camper.earlyDropoff && (
          <CamperDetailsBadge
            icon={<SunsetIcon fill="black" />}
            description="early drop-off"
            color="camperDetailsCards.earlyDropoff"
          />
        )}
        {camper.allergies && (
          <CamperDetailsBadge
            icon={<FontAwesomeIcon icon={faHandDots} />}
            description="has allergy"
            color="camperDetailsCards.hasAllergy"
          />
        )}
        {camper.specialNeeds && (
          <CamperDetailsBadge
            icon={<FontAwesomeIcon icon={faHandshakeAngle} />}
            description="additional needs"
            color="camperDetailsCards.additionalNeeds"
          />
        )}
      </HStack>
    </Container>
  );
};

export default CamperDetailsBadgeGroup;
