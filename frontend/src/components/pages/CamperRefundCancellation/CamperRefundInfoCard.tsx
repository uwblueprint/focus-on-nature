import React from "react";
import { Box, Text, Checkbox,VStack, StackDivider, Flex, Spacer } from "@chakra-ui/react";

const CamperRefundInfoCard = (props:any): React.ReactElement => {

  return (
    <Box
      backgroundColor="background.white.100"
      width="100%"
      borderRadius={10}
      borderColor="gray"
      borderWidth="1.75px"
    >
      <Box
        backgroundColor="background.white.100"
        pt="20px"
        pb="12px"
        pr="24px"
        pl="24px"
        borderRadius={10}
      >
        <Checkbox defaultChecked colorScheme="green" size="lg"> 
          <Text as="b" fontSize="2xl" marginLeft="5px"> FirstName LastName </Text>
        </Checkbox>
      </Box>
      <Box
        backgroundColor="#F5F5F5"
        pt="24px"
        pb="32px"
        pl="61px"
        pr="61px"
        borderRadius="0 0 10px 10px"
        width="100%"
      >
        <VStack
          divider={<StackDivider borderColor='gray.300' height="4px"/>}
          spacing={4}
          align='stretch'
        >
          <VStack>
            <Flex width="100%">
              <Text as="b" fontSize="xl">Item</Text>
              <Spacer />
              <Text as="b" fontSize="xl">Total Price (CAD)</Text>
            </Flex>
            <Flex width="100%">
              <Text fontSize="2xl">Session 1</Text>
              <Spacer />
              <Text fontSize="2xl">800$</Text>
            </Flex>
          </VStack>

          <VStack>
            <Flex width="100%">
              <VStack 
                width="50%" 
                spacing={2}
                align='stretch'
              >
                <Text fontSize="2xl">Session 1 EDLP</Text>
                <Text fontSize="sm">150 minutes</Text>
              </VStack>
             
              <Spacer />
              <Text fontSize="2xl" pt="15px" pb="0px">25$</Text>
            </Flex>
          </VStack>

          <Flex width="100%">
            <Text as="b" fontSize="xl">Total Refund for Camper 2</Text>
            <Spacer />
            <Text as="b" fontSize="xl">825$</Text>
          </Flex>

        </VStack>
      </Box>
    </Box>
  );
};

export default CamperRefundInfoCard;