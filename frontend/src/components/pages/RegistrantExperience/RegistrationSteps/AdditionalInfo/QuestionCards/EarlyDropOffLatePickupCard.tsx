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
import RequiredAsterisk from "../../../../../common/RequiredAsterisk";
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
  const invalid = nextClicked && requireEDLP === null;

  const handleMultipleChoiceUpdate = (choice: string) => {
    setRequireEDLP(choice === "true");
  };

  return (
    <QuestionsCardWrapper title="Early Drop-off and Late Pick-up">
      <Wrap>
        <WrapItem px={{ sm: "5", lg: "20" }} py={4}>
          <FormControl isInvalid={invalid}>
            <FormLabel textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
              Do your camper(s) require early drop-off or late pick-up?{" "}
              <Text
                as="span"
                color="text.critical.100"
                fontSize="xs"
                verticalAlign="super"
              >
                <RequiredAsterisk />
              </Text>
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
              value={requireEDLP?.toString()}
              onChange={(choice) => handleMultipleChoiceUpdate(choice)}
            >
              <VStack alignItems="flex-start">
                <Radio value="true" colorScheme="green">
                  <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>Yes</Text>
                </Radio>
                <Radio value="false" colorScheme="green">
                  <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>No</Text>
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
