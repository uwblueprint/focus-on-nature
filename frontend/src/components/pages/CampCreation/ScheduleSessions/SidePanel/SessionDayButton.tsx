import React from "react";
import { IconButton, Text } from "@chakra-ui/react";

type SessionDayButtonProps = {
  day: string;
  selected: boolean | undefined;
  onSelect: (day: string) => void;
};

const SessionDayButton = ({
  day,
  selected,
  onSelect,
}: SessionDayButtonProps): JSX.Element => {
  return (
    <IconButton
      key={day}
      aria-label="week day button"
      icon={<Text textStyle="bodyBold">{day}</Text>}
      isRound
      size="md"
      variant={selected ? "primary" : "backgroundInteractive"}
      onClick={() => onSelect(day)}
    />
  );
};

export default SessionDayButton;
