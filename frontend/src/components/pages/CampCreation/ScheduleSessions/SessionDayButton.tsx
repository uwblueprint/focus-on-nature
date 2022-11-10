import React from "react";
import { IconButton, Text } from "@chakra-ui/react";

type SessionDayButtonProps = {
  day: string;
  active: boolean | undefined;
  onSelect: (day: string) => void;
};

const SessionDayButton = ({
  day,
  active,
  onSelect,
}: SessionDayButtonProps): JSX.Element => {
  return (
    <IconButton
      key={day}
      aria-label="week day button"
      icon={<Text textStyle="bodyBold">{day}</Text>}
      isRound
      size="lg"
      variant={active ? "primaryGreen" : "backgroundInteractive"}
      onClick={() => onSelect(day)}
    />
  );
};

export default SessionDayButton;
