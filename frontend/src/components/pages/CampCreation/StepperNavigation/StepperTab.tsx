import React from "react";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";

type StepperTabProps = {
  title: string;
  stepNum: number;
  focused: boolean;
  icon: JSX.Element;
  onClick: () => void;
};

const StepperTab = ({
  title,
  stepNum,
  focused,
  icon,
  onClick,
}: StepperTabProps): React.ReactElement => {
  return (
    <Box onClick={onClick} cursor="pointer" mt={4} mb={4} ml="10vw" mr="10vw">
      <HStack spacing={4}>
        <Box>
          {focused ? (
            <IconButton
              icon={icon}
              colorScheme="primary.green"
              color="white"
              isRound
              size="lg"
              aria-label={title}
            />
          ) : (
            <IconButton
              icon={icon}
              variant="outline"
              colorScheme="text.grey"
              border="2px"
              isRound
              size="lg"
              aria-label={title}
            />
          )}
        </Box>
        <Box>
          <Text textStyle="caption">Step {stepNum}/3</Text>
          <Text textStyle="bodyBold">{title}</Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default StepperTab;
