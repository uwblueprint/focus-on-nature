import React from "react";
import { Flex, Image, VStack, Text } from "@chakra-ui/react";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";

import defaultCampImage from "../../../../assets/default_camp_image.png";
import { cardBoldStyles, regularTextStyles } from "./textStyles";

export type RegistrationInfoCardProps = {
  imageSrc: string;
  campName: string;
  sessions: string;
  registeredCampers: RegistrantExperienceCamper[];
};

const RegistrationInfoCard = ({
  imageSrc,
  campName,
  sessions,
  registeredCampers,
}: RegistrationInfoCardProps): React.ReactElement => {
  const formatCamperData = (camper: RegistrantExperienceCamper): string =>
    `${camper.firstName} (Age ${camper.age})`;

  // Produces formatted list of campers; eg. "Campers registered: John (Age 8) and Jane (Age 4)"
  const formatRegisteredCampers = (
    campers: RegistrantExperienceCamper[],
  ): string => {
    let campersString = "Campers registered: ";
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
      justify="space-between"
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
        w={{ base: "192px", lg: "6vw" }}
        h={{ base: "122px", lg: "6vh" }}
        mb={{ sm: 5 }}
      />
      <VStack align="flex-start" spacing={2} w={{ lg: "25vw" }}>
        <Text textStyle={cardBoldStyles}>{campName}</Text>
        <Text textStyle={regularTextStyles}>{sessions}</Text>
        <Text textStyle={{ base: "xSmallMedium", lg: "displaySmallSemiBold" }}>
          {formatRegisteredCampers(registeredCampers)}
        </Text>
      </VStack>
    </Flex>
  );
};

export default RegistrationInfoCard;
