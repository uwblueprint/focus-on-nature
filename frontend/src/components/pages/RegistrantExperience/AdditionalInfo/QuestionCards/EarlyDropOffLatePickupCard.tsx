import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import QuestionsCardWrapper from "./QuestionsCardWrapper";

type EarlyDropOffLatePickupCardProps = {
  setRequireEarlyDropOffLatePickup: (
    requireEarlyDropOffLatePickup: boolean,
  ) => void;
  submitClicked: boolean;
};

const EarlyDropOffLatePickupCard = ({
  setRequireEarlyDropOffLatePickup,
  submitClicked,
}: EarlyDropOffLatePickupCardProps): React.ReactElement => {
  const [multipleChoice, setMultipleChoice] = useState("");

  const invalid = submitClicked && multipleChoice === "";

  const handleMultipleChoiceUpdate = (choice: string) => {
    setMultipleChoice(choice);
    setRequireEarlyDropOffLatePickup(choice === "yes");
  };

  return (
    <QuestionsCardWrapper title="Early Drop-off and Late Pick-up">
      <Wrap>
        <WrapItem px="40px" py="12px">
          <FormControl isRequired isInvalid={invalid}>
            <FormLabel fontWeight="bold" fontSize="18px">
              Do your camper(s) require early drop-off or late pick-up?
            </FormLabel>
            <Text
              textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}
              mb="3"
            >
              Note: additional costs will apply. If needed, you may select
              drop-off and/or pick-up times on the next page{" "}
            </Text>
            {invalid && (
              <FormErrorMessage>
                Please fill out this question.
              </FormErrorMessage>
            )}
            <RadioGroup
              onChange={(choice) => handleMultipleChoiceUpdate(choice)}
            >
              <VStack alignItems="flex-start">
                <Radio value="yes" colorScheme="green">
                  Yes
                </Radio>
                <Radio value="no" colorScheme="green">
                  No
                </Radio>
              </VStack>
            </RadioGroup>
          </FormControl>
        </WrapItem>
      </Wrap>
    </QuestionsCardWrapper>
  );
};

export default EarlyDropOffLatePickupCard;
