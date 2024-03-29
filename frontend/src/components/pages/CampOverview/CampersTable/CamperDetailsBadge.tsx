import React from "react";
import { Container, Text, HStack } from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandDots,
  faHandshakeAngle,
  faEnvelopesBulk,
  faHourglassEnd,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

import { ReactComponent as PickupIcon } from "../../../../assets/icon_custom_sunrise.svg";
import { ReactComponent as SunriseIcon } from "../../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../../assets/icon_sunset.svg";

import { Camper, WaitlistedCamperStatus } from "../../../../types/CamperTypes";
import { checkDatesInRange } from "../../../../utils/CampUtils";

type CamperDetailsBadgeProps = {
  icon: JSX.Element;
  description: string;
  color: string;
};

const CamperDetailsBadge = ({
  icon,
  description,
  color,
}: CamperDetailsBadgeProps): JSX.Element => {
  return (
    <HStack
      alignContent="center"
      background={color}
      px="3"
      py="2"
      borderRadius="5"
    >
      {icon}
      <Text textStyle="bodyRegular">{description}</Text>
    </HStack>
  );
};

type CamperDetailsBadgeGroupProps = {
  camper: Camper;
  paddingLeft?: string;
  sessionDates: string[];
};

export const CamperDetailsBadgeGroup = ({
  camper,
  paddingLeft = "16px",
  sessionDates,
}: CamperDetailsBadgeGroupProps): JSX.Element => {
  const latePickupInSessionRange = checkDatesInRange(
    sessionDates,
    camper.latePickup,
  );
  const earlyDropoffInSessionRange = checkDatesInRange(
    sessionDates,
    camper.earlyDropoff,
  );
  const latePickup =
    camper.latePickup &&
    camper.latePickup.length > 0 &&
    latePickupInSessionRange;
  const earlyDropoff =
    camper.earlyDropoff &&
    camper.earlyDropoff.length > 0 &&
    earlyDropoffInSessionRange;

  return (
    <Container width="-webkit-fit-content" marginStart="0px" pl={paddingLeft}>
      <HStack>
        {latePickup && earlyDropoff && (
          <CamperDetailsBadge
            icon={<PickupIcon />}
            description="pick-up & drop-off"
            color="camperDetailsCards.latePickupAndEarlyDropOff"
          />
        )}
        {latePickup && !earlyDropoff && (
          <CamperDetailsBadge
            icon={<SunriseIcon fill="black" />}
            description="late pick-up"
            color="camperDetailsCards.latePickup"
          />
        )}
        {!latePickup && earlyDropoff && (
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

export const WaitlistDetailsBadgeGroup = ({
  status,
  linkExpiry,
}: {
  status: WaitlistedCamperStatus;
  linkExpiry?: Date;
}): React.ReactElement => {
  let bkgColor = "";
  let statusText = "";
  let icon: JSX.Element = <FontAwesomeIcon icon={faEnvelopesBulk} />;
  let validStatus = true;

  // This is a work around to a typing issue we are having
  // The linkExpiry prop is passed as a string, probably because we are using JSX.Element
  // This checks if the type is string and creates a date
  let linkExpiryDate = linkExpiry;
  if (typeof linkExpiry === "string") {
    linkExpiryDate = new Date(linkExpiry);
  }

  if (status === "Registered") {
    bkgColor = "waitlistCards.complete";
    statusText = "registration complete";
    icon = <FontAwesomeIcon icon={faUserCheck} />;
  } else if (linkExpiryDate && linkExpiryDate.getTime() < Date.now()) {
    bkgColor = "waitlistCards.expired";
    statusText = "registration expired";
    icon = <FontAwesomeIcon icon={faHourglassEnd} />;
  } else if (status === "RegistrationFormSent") {
    bkgColor = "waitlistCards.sent";
    statusText = "registration form sent";
    icon = <FontAwesomeIcon icon={faEnvelopesBulk} />;
  } else {
    validStatus = false;
  }

  return (
    <Container width="-webkit-fit-content" marginStart="0px">
      <HStack>
        {validStatus && (
          <CamperDetailsBadge
            icon={icon}
            description={statusText}
            color={bkgColor}
          />
        )}
      </HStack>
    </Container>
  );
};
