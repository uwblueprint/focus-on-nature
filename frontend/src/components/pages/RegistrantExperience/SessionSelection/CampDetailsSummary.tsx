import React from "react";
import { Text, HStack, VStack, Flex } from "@chakra-ui/react";
import { ReactComponent as SunriseIcon } from "../../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../../assets/icon_sunset.svg";
import { ReactComponent as PersonIcon } from "../../../../assets/person.svg";
import { ReactComponent as LocationIcon } from "../../../../assets/icon_location.svg";
import { CampResponse, Location } from "../../../../types/CampsTypes";
import { campDetailsStyles, campTitleStyles } from "./SessionSelectionStyles";
import { adjustTimeToAmPm } from "../../../../utils/CampUtils";

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
        <LocationIcon width={25} />
        <Text textStyle={campDetailsStyles}>
          {formatLocationString(camp.location)}
        </Text>
      </HStack>
      <HStack>
        <PersonIcon width={25} />
        <Text textStyle={campDetailsStyles}>
          {camp.ageLower} to {camp.ageUpper} years
        </Text>
      </HStack>
      <Flex direction={{ base: "column", lg: "row" }}>
        <HStack mr={{ base: "0px", lg: 8 }} mb={{ base: 2, lg: "0px" }}>
          <SunriseIcon fill="black" width={25} />
          <Text textStyle={campDetailsStyles}>
            Earliest drop off time: {adjustTimeToAmPm(camp.earlyDropoff)}
          </Text>
        </HStack>
        <HStack>
          <SunsetIcon fill="black" width={25} />
          <Text textStyle={campDetailsStyles}>
            Latest pick up time: {adjustTimeToAmPm(camp.latePickup)}
          </Text>
        </HStack>
      </Flex>
    </VStack>
  );
};

export default CampDetailsSummary;
