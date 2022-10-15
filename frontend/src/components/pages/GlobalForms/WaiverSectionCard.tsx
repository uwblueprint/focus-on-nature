import {
    Text, Box, Flex, HStack, Spacer,
  } from "@chakra-ui/react";
  import React from "react";
  
  interface WaiverSectionCardProps {
    title: string;
    waiverText: string;
    isRequired: boolean;
  }
  const WaiverSectionCard = ({
    title,
    waiverText,
    isRequired,
  }: WaiverSectionCardProps): JSX.Element => {
    return (
        <Box px="32px" pt="20px" pb="22px" bg='white' my="12px">
        <Flex pb="14px">
            <HStack spacing="20px" bg='white'>
                <Text textStyle="displaySmallSemiBold">{title}</Text>
                {isRequired && <Text borderRadius='50px' px={4} bg="background.required.100" color="text.critical.100"> required</Text>}
            </HStack>
            <Spacer/>
            <HStack spacing="20px">
                <Text textStyle="buttonSemiBold" color="text.success.100">Edit</Text>
                <Text textStyle="buttonSemiBold" color="text.critical.100">Delete</Text>
            </HStack>
        </Flex>
        <Text>{waiverText}</Text>
        </Box>
    );
  };
  
  export default WaiverSectionCard;
  