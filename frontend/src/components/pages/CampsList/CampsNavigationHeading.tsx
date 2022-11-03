import { Flex, Text, Box, IconButton, Button } from "@chakra-ui/react";
import React from "react";

import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import textStyles from "../../../theme/textStyles";
import { CAMP_CREATION_PAGE } from "../../../constants/Routes";

const CampsNavigationHeading = ({
  year,
  onNavigateLeft,
  onNavigateRight,
}: {
  year: number;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
}): React.ReactElement => {
  const history = useHistory();

  const navigateToCampCreationPage = () => {
    history.push(CAMP_CREATION_PAGE);
  };

  return (
    <Box marginBottom="10">
      <Text textStyle="displayXLarge">FON Camps</Text>
      <Flex
        direction="row"
        marginTop="16px"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Flex direction="row" alignItems="center">
          <IconButton
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
            fontSize="32px"
            aria-label="back-button"
            onClick={onNavigateLeft}
            backgroundColor="background.white.100"
          />
          <Text
            fontWeight={textStyles.displayXLarge.fontWeight}
            fontSize={textStyles.displayXLarge.fontSize}
            marginLeft="16px"
            marginRight="16px"
          >
            {year}
          </Text>
          <IconButton
            icon={<FontAwesomeIcon icon={faChevronRight} />}
            fontSize="32px"
            aria-label="forward-button"
            onClick={onNavigateRight}
            backgroundColor="background.white.100"
          />
        </Flex>
        <Button
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          aria-label="Add Camp"
          type="submit"
          border="2px"
          borderRadius="5px"
          color="primary.green.100"
          background="background.grey.200"
          borderColor="primary.green.100"
          minWidth="-webkit-fit-content"
          onClick={navigateToCampCreationPage}
        >
          Add Camp
        </Button>
      </Flex>
    </Box>
  );
};

export default CampsNavigationHeading;
