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
import React from "react";
import QuestionsCardWrapper from "./QuestionsCardWrapper";

type EarlyDropOffLatePickupCardProps = {
  requireEarlyDropOffLatePickup: boolean | null;
  setRequireEarlyDropOffLatePickup: (
    requireEarlyDropOffLatePickup: boolean,
  ) => void;
  submitClicked: boolean;
};

const EarlyDropOffLatePickupCard = ({
  requireEarlyDropOffLatePickup,
  setRequireEarlyDropOffLatePickup,
  submitClicked,
}: EarlyDropOffLatePickupCardProps): React.ReactElement => {
  const invalid = submitClicked && requireEarlyDropOffLatePickup === null;

  const handleMultipleChoiceUpdate = (choice: string) => {
    setRequireEarlyDropOffLatePickup(choice === "true");
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
              value={requireEarlyDropOffLatePickup?.toString()}
              onChange={(choice) => handleMultipleChoiceUpdate(choice)}
            >
              <VStack alignItems="flex-start">
                <Radio value="true" colorScheme="green">
                  Yes
                </Radio>
                <Radio value="false" colorScheme="green">
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
