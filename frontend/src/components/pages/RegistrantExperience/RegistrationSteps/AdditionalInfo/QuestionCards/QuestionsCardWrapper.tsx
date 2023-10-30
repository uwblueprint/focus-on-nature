import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

type QuestionsCardWrapperProps = {
  title: string;
  children: React.ReactNode;
};

const QuestionsCardWrapper = ({
  title,
  children,
}: QuestionsCardWrapperProps): JSX.Element => {
  return (
    <Box
      width="100%"
      backgroundColor="background.grey.500"
      marginY={10}
      boxShadow="lg"
      rounded="xl"
      borderWidth={1}
      paddingBottom={5}
    >
      <Box
        backgroundColor="background.white.100"
        borderTopRadius={10}
        borderBottomWidth={1}
      >
        <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
          <Text textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}>
            {title}
          </Text>
        </Flex>
      </Box>
      {children}
    </Box>
  );
};

export default QuestionsCardWrapper;
