import React from "react";
import { Container, Flex, Show } from "@chakra-ui/react";
import { NavBarIcon } from "./NavBar";

const EmptyNavBar = (): JSX.Element => {
  return (
    <Show above="md">
      <Container maxWidth="100vw" bg="white">
        <Flex
          bg="white"
          direction="row"
          justifyContent="space-between"
          align="center"
          height="68px"
          marginLeft="80px"
          marginRight="80px"
        >
          <Flex minW="40px" flex="1">
            <NavBarIcon />
          </Flex>
        </Flex>
      </Container>
    </Show>
  );
};
export default EmptyNavBar;
