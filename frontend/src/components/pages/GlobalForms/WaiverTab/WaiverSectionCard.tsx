import React from "react";
import { Text, Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";

interface WaiverSectionCardProps {
  clauseIdx: number;
  clauseData: WaiverClause;
}
const WaiverSectionCard = ({
  clauseIdx,
  clauseData,
}: WaiverSectionCardProps): JSX.Element => {
  function getSectionTitle(number: number) {
    const code = "A".charCodeAt(0);
    return `Section ${String.fromCharCode(code + number)}`;
  }

  return (
    <Box px="32px" pt="20px" pb="22px" bg="background.grey.100" my="12px">
      <Flex pb="14px">
        <HStack spacing="20px">
          <Text textStyle="displaySmallSemiBold">
            {getSectionTitle(clauseIdx)}
          </Text>
          {clauseData.required && (
            <Text
              borderRadius="50px"
              px={4}
              bg="background.required.100"
              color="text.critical.100"
            >
              required
            </Text>
          )}
        </HStack>
        <Spacer />
        <HStack spacing="20px">
          <Text textStyle="buttonSemiBold" color="text.success.100">
            Edit
          </Text>
          <Text textStyle="buttonSemiBold" color="text.critical.100">
            Delete
          </Text>
        </HStack>
      </Flex>
      <Text>{clauseData.text}</Text>
    </Box>
  );
};

export default WaiverSectionCard;
