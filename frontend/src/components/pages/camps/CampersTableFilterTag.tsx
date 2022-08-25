import React from "react";

import { Text, HStack } from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faHandDots,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";

import { ReactComponent as SunriseIcon } from "../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../assets/icon_sunset.svg";

import { Camper } from "../../../types/CamperTypes";
import { Filter } from "./CampersTableFilterTypes";

const CampersTableFilterTagItem = ({
  icon,
  description,
  itemColor,
}: {
  icon: JSX.Element;
  description: string;
  itemColor: string;
}): JSX.Element => {
  return (
    <HStack alignContent="center" color={itemColor}>
      {icon}
      <Text fontWeight="bold">{description}</Text>
    </HStack>
  );
};

const CampersTableFilterTag = ({
  filterOption,
  selectedFilter,
  campers,
  campSessionCapacity,
  camperDetailsCount,
}: {
  filterOption: Filter;
  selectedFilter: Filter;
  campers: Camper[];
  campSessionCapacity: number;
  camperDetailsCount: { [key: string]: number };
}): JSX.Element => {
  let icon: JSX.Element;
  let description: string;
  let color = "black";

  const capacityBadgeColor = (option: Filter): string => {
    let tempColor = "text.default.100";
    if (selectedFilter === option) tempColor = "white";
    else if (campers.length >= campSessionCapacity)
      tempColor = "text.critical.100";
    return tempColor;
  };

  const badgeColor = (option: Filter): string => {
    return selectedFilter === option ? "white" : "text.default.100";
  };

  switch (filterOption) {
    case Filter.EARLY_DROP_OFF:
      icon = <SunsetIcon fill={badgeColor(filterOption)} />;
      description = camperDetailsCount.earlyDropoff.toString();
      color = badgeColor(filterOption);
      break;
    case Filter.LATE_PICK_UP:
      icon = <SunriseIcon fill={badgeColor(filterOption)} />;
      description = camperDetailsCount.latePickup.toString();
      color = badgeColor(filterOption);
      break;
    case Filter.HAS_ALLERGIES:
      icon = <FontAwesomeIcon icon={faHandDots} />;
      description = camperDetailsCount.allergies.toString();
      color = badgeColor(filterOption);
      break;
    case Filter.ADDITIONAL_NEEDS:
      icon = <FontAwesomeIcon icon={faHandshakeAngle} />;
      description = camperDetailsCount.specialNeeds.toString();
      color = badgeColor(filterOption);
      break;
    default:
      icon = <FontAwesomeIcon icon={faPerson} />;
      description = campers.length
        .toString()
        .concat("/")
        .concat(campSessionCapacity.toString());
      color = capacityBadgeColor(filterOption);
      break;
  }

  return (
    <CampersTableFilterTagItem
      icon={icon}
      description={description}
      itemColor={color}
    />
  );
};

export default CampersTableFilterTag;
