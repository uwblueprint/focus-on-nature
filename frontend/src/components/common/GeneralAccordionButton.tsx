import React from "react";
import { AccordionButton, AccordionIcon, Box, Text } from "@chakra-ui/react";

type GeneralAccordionButtonProps = {
  title: string;
};

const GeneralAccordionButton = ({
  title,
}: GeneralAccordionButtonProps): React.ReactElement => {
  return (
    <AccordionButton
      borderRadius="20px"
      bg="primary.green.600"
      _hover={{ bg: "primary.green.600" }}
    >
      <Box flex="1" textAlign="left">
        <Text
          color="text.white.100"
          textStyle={{
            sm: "xSmallMedium",
            md: "bodyBold",
            lg: "displayLarge",
          }}
          p={2}
        >
          {title}
        </Text>
      </Box>
      <AccordionIcon color="white" fontSize="2.5em" />
    </AccordionButton>
  );
};

export default GeneralAccordionButton;
