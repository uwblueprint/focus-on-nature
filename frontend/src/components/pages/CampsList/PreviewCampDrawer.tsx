import React from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { FontWeights } from "../../../theme/textStyles";
import CampStatusLabel from "./CampStatusLabel";
import { getCampStatus, locationString } from "../../../utils/CampUtils";
import { CampResponse, CampSession } from "../../../types/CampsTypes";
import PreviewModalSessionRow from "./PreviewModalSessionRow";

type CampDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  camp: CampResponse | undefined;
};

const PreviewCampDrawer = ({
  isOpen,
  onClose,
  camp,
}: CampDrawerProps): JSX.Element => {
  return camp ? (
    <Flex
      bg="background.white.100"
      w="500px"
      h="calc(100vh - 68px)"
      position="absolute"
      pos="fixed"
      right={isOpen ? "0px" : "-500px"}
      transition="right 0.5s"
      borderWidth="1px 0 1px 1px"
      borderColor="border.secondary.100"
      flexDirection="column"
    >
      <Box paddingRight="32px" paddingLeft="32px">
        <Text
          onClick={onClose}
          color="#A3AEBE"
          textDecoration="underline"
          marginTop="32px"
          textAlign="right"
          textStyle="xSmallBold"
          cursor="pointer"
        >
          Close
        </Text>
        <Text textStyle="displayMediumBold" marginTop="20px">
          {camp.name}
        </Text>

        <Text textStyle="heading" fontWeight={FontWeights.REGULAR}>
          {locationString(camp.location)}
        </Text>

        <Box marginTop="12px" w="fit-content">
          {camp ? <CampStatusLabel status={getCampStatus(camp)} /> : ""}
        </Box>
        <Box
          marginTop="20px"
          padding="16px 32px"
          borderRadius="5px"
          borderWidth="2px"
          borderColor="border.input.100"
        >
          <Text textStyle="buttonSemiBold">
            Daily Camp Fee:{" "}
            <Text as="span" textStyle="buttonRegular">
              ${camp.fee} per day
            </Text>
          </Text>
          <Text textStyle="buttonSemiBold">
            Age Range:{" "}
            <Text as="span" textStyle="buttonRegular">
              {camp.ageLower} to {camp.ageUpper}
            </Text>
          </Text>
        </Box>
        <Box margin="20px 0">
          <Button
            marginRight="20px"
            aria-label="View Camp"
            border="1px"
            borderRadius="5px"
            color="primary.green.100"
            bg="white"
            borderColor="primary.green.100"
            minWidth="-webkit-fit-content"
          >
            View Camp
          </Button>
          <Button
            marginRight="20px"
            aria-label="View Camp"
            border="1px"
            borderRadius="5px"
            color="secondary.critical.100"
            bg="white"
            borderColor="secondary.critical.100"
            minWidth="-webkit-fit-content"
          >
            Delete Camp
          </Button>
        </Box>
      </Box>

      <Flex
        bg="background.grey.100"
        paddingRight="32px"
        paddingLeft="32px"
        borderTop="1px"
        borderColor="border.secondary.100"
        overflowY="auto"
        flexGrow="1"
        flexDirection="column"
        sx={{
          "&::-webkit-scrollbar": {
            backgroundColor: `white`,
          },
          "&::-webkit-scrollbar-thumb": {
            width: "8px",
            borderRadius: "12px",
            backgroundColor: `#A3AEBE`,
          },
          "&::-webkit-scrollbar-button": {
            display: `none`,
          },
        }}
      >
        <Text textStyle="buttonSemiBold" marginTop="24px" marginBottom="20px">
          {camp.campSessions.length} Session
          {camp.campSessions.length !== 1 ? "s" : ""}
        </Text>

        {camp.campSessions.map((session: CampSession, key: number) => {
          return (
            <PreviewModalSessionRow
              key={key}
              sessionNum={key + 1}
              status={getCampStatus(camp)}
              session={session}
            />
          );
        })}
      </Flex>
    </Flex>
  ) : (
    <></>
  );
};

export default PreviewCampDrawer;
