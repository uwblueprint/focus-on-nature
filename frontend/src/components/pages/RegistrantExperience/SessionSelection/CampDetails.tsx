import React from "react";
import { Text, HStack, VStack } from "@chakra-ui/react";
import { ReactComponent as SunriseIcon } from "../../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../../assets/icon_sunset.svg";
import { ReactComponent as PersonIcon } from "../../../../assets/person.svg";
import { ReactComponent as LocationIcon } from "../../../../assets/icon_location.svg";
import { CampResponse, Location } from "../../../../types/CampsTypes";
import { campDetailsStyles, campTitleStyles } from "./SessionSelectionStyles";

type CampDetailsProps = {
  camp: CampResponse;
};

const CampDetails = ({ camp }: CampDetailsProps): React.ReactElement => {
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
      <HStack>
        <SunriseIcon fill="black" width={25} />
        <Text textStyle={campDetailsStyles}>
          Earliest drop off time: {camp.earlyDropoff} AM
        </Text>
      </HStack>
      <HStack>
        <SunsetIcon fill="black" width={25} />
        <Text textStyle={campDetailsStyles}>
          Latest pick up time: {camp.latePickup} PM
        </Text>
      </HStack>
    </VStack>
  );
};

export default CampDetails;
