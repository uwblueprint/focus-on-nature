import { Flex, IconButton, Text, Box } from "@chakra-ui/react";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import textStyles from "../../../theme/textStyles";
import { CampResponse } from "../../../types/CampsTypes";

type CampSessionInfoHeaderProps = {
  camp: CampResponse;
  currentCampSession: number;
  onNextSession: () => void;
  onPrevSession: () => void;
};

const CampSessionInfoHeader = ({
  camp,
  currentCampSession,
  onNextSession,
  onPrevSession,
}: CampSessionInfoHeaderProps): React.ReactElement => {
  const numSessions = camp.campSessions.length;
  const campSession = camp.campSessions[currentCampSession];

  const campSessionStartDate = new Date(
    campSession.dates[0],
  ).toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
  const campSessionEndDate = new Date(
    campSession.dates[campSession.dates.length - 1],
  ).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Box marginBottom="20px">
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
          onClick={onPrevSession}
          backgroundColor="background.grey.200"
          marginStart="2.5"
        />
        <IconButton
          icon={<FontAwesomeIcon icon={faChevronRight} />}
          size="lg"
          aria-label="next-button"
          onClick={onNextSession}
          backgroundColor="background.grey.200"
        />
      </Flex>
      <Text textStyle="displaySmallRegular">
        {campSessionStartDate} - {campSessionEndDate} | {camp.startTime} -{" "}
        {camp.endTime}
      </Text>
      <Box marginTop="16px">
        <Flex>
          <Text textStyle="buttonRegular">Session Age Range:</Text>
          <Text
            fontWeight={textStyles.bodyBold.fontWeight}
            fontSize={textStyles.buttonRegular.fontSize}
          >
            &nbsp;{camp.ageLower} - {camp.ageUpper}
          </Text>
        </Flex>
        <Flex>
          <Text textStyle="buttonRegular">Camp Capacity:</Text>
          <Text
            fontWeight={textStyles.bodyBold.fontWeight}
            fontSize={textStyles.buttonRegular.fontSize}
          >
            &nbsp;{campSession.capacity} campers
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default CampSessionInfoHeader;
