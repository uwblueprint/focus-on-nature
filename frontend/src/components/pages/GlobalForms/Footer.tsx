import { Button, Flex, Spacer } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Flex
      pos="fixed"
      bottom="0"
      width="full"
      bg="background.grey.100"
      padding="16px 40px 16px 40px"
      boxShadow="xs"
    >
      <Spacer />
      <Button
        size="sm"
        bgColor="primary.green.100"
        color="background.white.100"
        p="16px"
      >
        + Add form section
      </Button>
    </Flex>
  );
};

export default Footer;
