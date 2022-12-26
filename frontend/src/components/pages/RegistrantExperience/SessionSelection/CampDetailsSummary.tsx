import React from "react";
import { Text, HStack, VStack, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPerson } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as SunriseIcon } from "../../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../../assets/icon_sunset.svg";
import { CampResponse, Location } from "../../../../types/CampsTypes";
import { campDetailsStyles, campTitleStyles } from "./SessionSelectionStyles";
import { getMeridianTime } from "../../../../utils/CampUtils";

type CampDetailsSummaryProps = {
  camp: CampResponse;
};

const CampDetailsSummary = ({
  camp,
}: CampDetailsSummaryProps): React.ReactElement => {
  const formatLocationString = (location: Location) =>
    `${location.streetAddress1}, ${location.city}, ${location.province} ${location.postalCode}`;

  return (
    <VStack spacing={2} align="flex-start">
      <Text textStyle={campTitleStyles}>{camp.name}</Text>
      <HStack>
        <FontAwesomeIcon icon={faLocationDot} width={25} />
        <Text textStyle={campDetailsStyles}>
          {formatLocationString(camp.location)}
        </Text>
      </HStack>
      <HStack>
        <FontAwesomeIcon icon={faPerson} width={25} />
        <Text textStyle={campDetailsStyles}>
          {camp.ageLower} to {camp.ageUpper} years
        </Text>
      </HStack>
      <Flex direction={{ base: "column", lg: "row" }}>
        <HStack mr={{ base: "0px", lg: 8 }} mb={{ base: 2, lg: "0px" }}>
          <SunriseIcon fill="black" width={25} />
          <Text textStyle={campDetailsStyles}>
            Earliest drop off time:{" "}
            {camp.earlyDropoff.trim()
              ? getMeridianTime(camp.earlyDropoff)
              : getMeridianTime(camp.startTime)}
          </Text>
        </HStack>
        <HStack>
          <SunsetIcon fill="black" width={25} />
          <Text textStyle={campDetailsStyles}>
            Latest pick up time:{" "}
            {camp.latePickup.trim()
              ? getMeridianTime(camp.latePickup)
              : getMeridianTime(camp.endTime)}
          </Text>
        </HStack>
      </Flex>
    </VStack>
  );
};

export default CampDetailsSummary;
