import React from "react";

import {
  Container,
  Text,
  Image,
  HStack,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandDots,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";

import icon_pickup from "../../../assets/icon_custom_sunrise.svg";

import { Camper } from "../../../types/CamperTypes";

export const CamperDetailsBadge = ({
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
        background={color}
        px="5"
        py="2"
        borderRadius="5"
      >
        {customIcon ? (
          <Image src={icon} display="inline" maxWidth="22px" />
        ) : (
          <FontAwesomeIcon icon={icon} />
        )}
        <Text>{description}</Text>
      </HStack>
    );
  };
  
  export const CamperDetailsBadgeGroup = ({ camper }: { camper: Camper }) => {
    return (
      <Container width="-webkit-fit-content" marginStart="0px">
        <HStack>
          {camper.latePickup && camper.earlyDropoff && (
            <CamperDetailsBadge
              customIcon
              icon={icon_pickup}
              description="pick-up & drop-off"
              color="camperDetailsCards.pickup"
            />
          )}
          {camper.allergies && (
            <CamperDetailsBadge
              customIcon={false}
              icon={faHandDots}
              description="has allergy"
              color="camperDetailsCards.hasAllergy"
            />
          )}
          {camper.specialNeeds && (
            <CamperDetailsBadge
              customIcon={false}
              icon={faHandshakeAngle}
              description="additional needs"
              color="camperDetailsCards.additionalNeeds"
            />
          )}
        </HStack>
      </Container>
    );
  };