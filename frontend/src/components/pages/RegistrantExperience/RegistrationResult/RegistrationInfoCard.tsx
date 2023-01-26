import React from "react";
import { Flex, Image, VStack, Text } from "@chakra-ui/react";

import defaultCampImage from "../../../../assets/default_camp_image.png";
import { cardBoldStyles, regularTextStyles } from "./textStyles";
import { CampSession } from "../../../../types/CampsTypes";
import { sortDatestrings } from "../../../../utils/CampUtils";

export type RegistrationInfoCardProps = {
  imageSrc: string;
  campName: string;
  sessions: CampSession[];
  registeredCampers: RegistrantInfoCamper[];
  isWaitListSummary?: boolean;
};

const formatSessionDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatSessionInfo = (index: number, dates: string[]): string => {
  const sortedDates = sortDatestrings(dates);
  let sessionStr = `Session ${index + 1} - ${formatSessionDate(
    sortedDates[0],
  )}`;

  if (sortedDates.length > 1) {
    sessionStr += ` to ${formatSessionDate(
      sortedDates[sortedDates.length - 1],
    )}`;
  }

  return sessionStr;
};

interface RegistrantInfoCamper {
  firstName: string;
  lastName: string;
  age: number;
}

const RegistrationInfoCard = ({
  imageSrc,
  campName,
  sessions,
  registeredCampers,
  isWaitListSummary,
}: RegistrationInfoCardProps): React.ReactElement => {
  const formatCamperData = (camper: RegistrantInfoCamper): string =>
    `${camper.firstName} (Age ${camper.age})`;

  // Produces formatted list of campers; eg. "Campers registered: John (Age 8) and Jane (Age 4)"
  const formatRegisteredCampers = (
    campers: RegistrantInfoCamper[],
    isForWaitList?: boolean,
  ): string => {
    let campersString = isForWaitList
      ? "Campers registered: "
      : "Campers on waitlist: ";
    if (campers.length === 1) {
      campersString += formatCamperData(campers[0]);
    } else if (campers.length === 2) {
      campersString += `${formatCamperData(campers[0])} and ${formatCamperData(
        campers[1],
      )}`;
    } else {
      campersString += campers.reduce(
        (namesString, camper, index) =>
          `${namesString}${index === 0 ? "" : ","} ${
            index + 1 === campers.length ? "and " : ""
          }${camper.firstName} (Age ${camper.age})`,
        "",
      );
    }

    return campersString;
  };

  return (
    <Flex
      direction="row"
      justify="space-around"
      align="center"
      w="100%"
      border="1px solid"
      borderColor="border.default.100"
      borderRadius="10px"
      backgroundColor="background.grey.200"
      py={10}
      px={5}
      flexWrap="wrap"
    >
      <Image
        fallbackSrc={defaultCampImage}
        src={imageSrc}
        alt="Camp image"
        w={{ base: "192px", lg: "120px" }}
        h={{ base: "122px", lg: "71px" }}
        mb={{ sm: 5, md: 0 }}
      />
      <VStack align="flex-start" spacing={2} w={{ md: "60%", lg: "70%" }}>
        <Text textStyle={cardBoldStyles}>{campName}</Text>
        {sessions
          .sort(
            (sessionA, sessionB) =>
              new Date(sessionA.dates[0]).getTime() -
              new Date(sessionB.dates[0]).getTime(),
          )
          .map((campSession, index) => {
            return (
              <Text textStyle={regularTextStyles} key={index}>
                {formatSessionInfo(index, campSession.dates)}
              </Text>
            );
          })}
        <Text
          textStyle={{ sm: "xSmallMedium", lg: "displaySmallSemiBold" }}
          textAlign="left"
        >
          {formatRegisteredCampers(registeredCampers, isWaitListSummary)}
        </Text>
      </VStack>
    </Flex>
  );
};

export default RegistrationInfoCard;
