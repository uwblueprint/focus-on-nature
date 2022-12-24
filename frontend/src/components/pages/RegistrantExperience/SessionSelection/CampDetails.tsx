import React from "react";
import { Box, Text, Grid, GridItem, HStack } from "@chakra-ui/react";
import { ReactComponent as SunriseIcon } from "../../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../../assets/icon_sunset.svg";
import { ReactComponent as PersonIcon } from "../../../../assets/person.svg";
import { ReactComponent as LocationIcon } from "../../../../assets/icon_location.svg";

const CampDetails = ({
  name,
  ageLower,
  ageUpper,
  earlyDropoff,
  latePickup,
  location,
}: {
  name: string;
  ageLower: number;
  ageUpper: number;
  earlyDropoff: string;
  latePickup: string;
  location: string;
}): React.ReactElement => {
  return (
    <Box>
      <Box mb={4} mt={{ sm: 3, md: 5, lg: 2 }}>
        <Text fontSize={{ sm: "xl", md: "2xl", lg: "3xl" }} as="b">
          {" "}
          {name}{" "}
        </Text>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem mb={2} colSpan={2}>
          <HStack>
            <LocationIcon width={25} />
            <Text>{location}</Text>
          </HStack>
        </GridItem>
        <GridItem mb={2} colSpan={2}>
          <HStack>
            <PersonIcon width={25} />
            <Text>
              {ageLower} to {ageUpper} years
            </Text>
          </HStack>
        </GridItem>
        <GridItem mb={{ sm: 2, md: 2, lg: 0 }} colSpan={[2, 2, 2, 1]}>
          <HStack>
            <SunriseIcon fill="black" width={25} />
            <Text>Earliest drop off time: {earlyDropoff} AM</Text>
          </HStack>
        </GridItem>
        <GridItem mb={2} colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <HStack>
            <SunsetIcon fill="black" />
            <Text>Latest pick up time: {latePickup} PM</Text>
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CampDetails;
