import { Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import EDLPSelectionControl from "./EDLPSelectionControl";
import QuestionsCardWrapper from "./QuestionsCardWrapper";

type EarlyDropOffLatePickupCardProps = {
  requireEDLP: boolean | null;
  setRequireEDLP: (setRequireEDLP: boolean) => void;
  nextClicked: boolean;
};

const EarlyDropOffLatePickupCard = ({
  requireEDLP,
  setRequireEDLP,
  nextClicked,
}: EarlyDropOffLatePickupCardProps): React.ReactElement => {
  return (
    <QuestionsCardWrapper title="Early Drop-off and Late Pick-up">
      <Wrap>
        <WrapItem px={{ sm: "5", lg: "20" }} py={4}>
          <EDLPSelectionControl
            requireEDLP={requireEDLP}
            setRequireEDLP={setRequireEDLP}
            nextClicked={nextClicked}
          />
        </WrapItem>
      </Wrap>
    </QuestionsCardWrapper>
  );
};

export default EarlyDropOffLatePickupCard;
