import { Flex, IconButton, Text, Box, Button } from "@chakra-ui/react";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import textStyles from "../../../theme/textStyles";
import { CampResponse } from "../../../types/CampsTypes";
import { getFormattedSessionDatetime } from "../../../utils/CampUtils";

type CampSessionInfoHeaderProps = {
  camp: CampResponse;
  currentCampSession: number;
  onNextSession: () => void;
  onPrevSession: () => void;
  onClickManageSessions: () => void;
};

const CampSessionInfoHeader = ({
  camp,
  currentCampSession,
  onNextSession,
  onPrevSession,
  onClickManageSessions,
}: CampSessionInfoHeaderProps): React.ReactElement => {
  const numSessions = camp.campSessions.length;
  const campSession = camp.campSessions[currentCampSession];

  return (
    <Box marginBottom="20px">
      <Flex direction="row" justify="space-between">
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
        <Button
          color="primary.green.100"
          variant="outline"
          border="1px"
          borderColor="primary.green.100"
          borderRadius="5px"
          size="lg"
          textStyle="button.semibold"
          onClick={onClickManageSessions}
        >
          Manage Sessions
        </Button>
      </Flex>
      <Text textStyle="displaySmallRegular">
        {getFormattedSessionDatetime(
          campSession.dates,
          camp.startTime,
          camp.endTime,
          true,
        )}
      </Text>
      <Box marginTop="16px">
        <Flex>
          <Text textStyle="buttonRegular">Session Age Range:</Text>
          <Text textStyle="buttonSemiBold">
            &nbsp;{camp.ageLower} - {camp.ageUpper}
          </Text>
        </Flex>
        <Flex>
          <Text textStyle="buttonRegular">Camp Capacity:</Text>
          <Text textStyle="buttonSemiBold">
            &nbsp;{campSession.capacity} campers
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default CampSessionInfoHeader;
