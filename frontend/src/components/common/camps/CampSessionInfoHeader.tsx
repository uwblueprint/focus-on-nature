import { Container, Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import textStyles from "../../../theme/textStyles";

type CampSessionInfoHeaderProps = {
  camp: any;
};

const CampSessionInfoHeader = ({
  camp,
}: CampSessionInfoHeaderProps): React.ReactElement => {
  const [currentCampSession, setCurrentCampSession] = useState(0);
  const numSessions = camp.campSessions.length;

  const nextSession = () => {
    if (numSessions >= 2)
      setCurrentCampSession(
        currentCampSession === numSessions - 1 ? 0 : currentCampSession + 1,
      );
  };

  const prevSession = () => {
    if (numSessions >= 2)
      setCurrentCampSession(
        currentCampSession === 0 ? numSessions - 1 : currentCampSession - 1,
      );
  };

  return (
    <Container maxWidth="100vw">
      <Flex direction="row" alignItems="center">
        <Text
          fontWeight={textStyles.displayXLarge.fontWeight}
          fontSize={textStyles.displayXLarge.fontSize}
        >
          Session {currentCampSession + 1} of {numSessions}
        </Text>
        <IconButton
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
          size="lg"
          aria-label="back-button"
          onClick={prevSession}
          backgroundColor="background.white.100"
          marginStart="2.5"
        />
        <IconButton
          icon={<FontAwesomeIcon icon={faChevronRight} />}
          size="lg"
          aria-label="next-button"
          onClick={nextSession}
          backgroundColor="background.white.100"
        />
      </Flex>
      <Text
        fontWeight={textStyles.displaySmallRegular.fontWeight}
        fontSize={textStyles.displaySmallRegular.fontSize}
      >
        {camp.campSessions[currentCampSession].dates[0].toLocaleDateString(
          "en-us",
          {
            month: "short",
            day: "numeric",
          },
        )}{" "}
        -{" "}
        {camp.campSessions[currentCampSession].dates[1].toLocaleDateString(
          "en-us",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        )}{" "}
        | {camp.startTime} - {camp.endTime}
      </Text>
      <Text
        fontWeight={textStyles.displaySmallRegular.fontWeight}
        fontSize={textStyles.displaySmallRegular.fontSize}
      >
        Session Age Range: {camp.ageLower} - {camp.ageUpeer}
      </Text>
    </Container>
  );
};

export default CampSessionInfoHeader;
