import React from "react";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

enum TabState {
  Focused,
  Available,
  Disabled,
}

type StepperTabProps = {
  title: string;
  stepNum: number;
  totalSteps: number;
  filled: boolean;
  focused: boolean;
  available: boolean;
  icon: JSX.Element;
  onClick: () => void;
};

const StepperTab = ({
  title,
  stepNum,
  totalSteps,
  filled,
  focused,
  available,
  icon,
  onClick,
}: StepperTabProps): React.ReactElement => {
  let iconColorScheme = "stepper.disabled";
  let tabState: TabState = TabState.Disabled;

  if (available) {
    tabState = TabState.Available;
    iconColorScheme = "stepper.available";
  }

  if (focused) {
    tabState = TabState.Focused;
    iconColorScheme = "stepper.focused";
  }

  return (
    <Box
      onClick={available ? onClick : undefined}
      cursor={tabState === TabState.Disabled ? "not-allowed" : "pointer"}
      my={5}
    >
      <HStack spacing={4}>
        <Box>
          <IconButton
            icon={filled ? <FontAwesomeIcon icon={faCheck} /> : icon}
            colorScheme={iconColorScheme}
            size="lg"
            aria-label={title}
            isRound
            border="2px"
            variant={tabState === TabState.Focused ? "solid" : "outline"}
            _hover={
              tabState === TabState.Disabled
                ? { cursor: "not-allowed" }
                : { cursor: "pointer" }
            }
          />
        </Box>
        <Box>
          <Text textStyle="caption">
            Step {stepNum}/{totalSteps}
          </Text>
          <Text textStyle="bodyBold">{title}</Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default StepperTab;
