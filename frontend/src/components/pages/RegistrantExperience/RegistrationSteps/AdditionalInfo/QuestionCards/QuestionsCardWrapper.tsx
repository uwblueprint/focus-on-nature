import { Box, Text } from "@chakra-ui/react";
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
      backgroundColor="background.grey.200"
      marginY={10}
      boxShadow="lg"
      rounded="xl"
      borderWidth={1}
      paddingBottom={5}
    >
      <Box
        backgroundColor="background.white.100"
        borderTopRadius={10}
        px="40px"
        py="12px"
        borderBottomWidth={1}
      >
        <Text textStyle="displaySmallSemiBold">{title}</Text>
      </Box>
      {children}
    </Box>
  );
};

export default QuestionsCardWrapper;
