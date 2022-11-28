import React from "react";
import {
  Box,
  Text,
  VStack,
  Checkbox,
  ListItem,
  OrderedList,
  Stack,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Input,
  Divider,
  HStack,
} from "@chakra-ui/react";
import {
  OptionalClauseResponse,
  RequiredClauseResponse,
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "./waiverTypes";

interface WaiverPageProps {
  waiverInterface: WaiverInterface;
  waiverDispatch: React.Dispatch<WaiverReducerDispatch>;
}

const WaiverPage = ({
  waiverInterface,
  waiverDispatch,
}: WaiverPageProps): React.ReactElement => {
  return (
    <Box>
      <VStack spacing={3} pt={1} align="stretch">
        <Text textStyle="displayXLarge">
          {waiverInterface.campName} Registration
        </Text>
        <Text textStyle="displayLarge" color="primary.green.100">
          Waiver
        </Text>
        <Text textStyle="buttonSemiBold" pt={6}>
          In consideration of the participation of my child/children, (the
          “child or children“), in the Focus on Nature photography camp/workshop
          and all activities associated therewith, I, the undersigned
          parent/guardian of the child/children, agree to the following terms
          and conditions:
        </Text>
      </VStack>

      <VStack spacing={5} pt={10} align="stretch">
        <Text color="primary.green.100" textStyle="heading">
          Identity and Waiver of Liability
        </Text>

        <OrderedList pl={10} spacing={5}>
          {waiverInterface.requiredClauses.map(
            (clause: RequiredClauseResponse, index: number) => (
              <ListItem textStyle="bodyRegular" key={index}>
                {clause.text}
              </ListItem>
            ),
          )}
        </OrderedList>
      </VStack>

      <VStack spacing={5} pt={10} align="stretch">
        <Text textStyle="heading">
          By clicking the checkbox below, you agree to the terms and conditions
          above.
        </Text>
        <Checkbox
          isChecked={waiverInterface.agreedRequiredClauses}
          onChange={() =>
            waiverDispatch({ type: WaiverActions.ClICK_REQUIRED_CLAUSE })
          }
        >
          <Text textStyle="bodyRegular">
            I agree to the above identity and liability waiver conditions{" "}
            <Text as="span" color="text.critical.100" verticalAlign="super">
              *
            </Text>
          </Text>
        </Checkbox>
      </VStack>
      <Divider pt={4} pb={4} borderColor="border.secondary.100" />
      <VStack spacing={5} pt={8} align="stretch">
        <Text color="primary.green.100" textStyle="heading">
          Additional Clauses
        </Text>
        {waiverInterface.optionalClauses.map(
          (clause: OptionalClauseResponse, index: number) => (
            <VStack spacing={6} pt={2} align="stretch" key={index}>
              <Text textStyle="bodyRegular">{clause.text}</Text>
              <RadioGroup
                onChange={() =>
                  waiverDispatch({
                    type: WaiverActions.CLICK_OPTIONAL_CLAUSE,
                    optionalClauseId: index,
                  })
                }
                key={index}
                value={String(clause.agreed)}
              >
                <Stack spacing={5} direction="row">
                  <Radio value="true" mb={0} textStyle="bodyRegular">
                    {/* NOTE!?: I use mb='0' because there's a margin misalignment issue with Radio component */}
                    I agree
                  </Radio>
                  <Radio value="false" textStyle="bodyRegular">
                    I{" "}
                    <Text as="span" textStyle="bodyBold">
                      do not
                    </Text>{" "}
                    agree
                  </Radio>
                </Stack>
              </RadioGroup>
            </VStack>
          ),
        )}
      </VStack>
      <Divider
        pt={4}
        pb={4}
        borderColor="border.secondary.100"
        textStyle="heading"
      />
      <Text textStyle="heading" pt={6}>
        By typing my name below, I hereby declare that I fully release and
        discharge Focus on Nature, its employees and volunteers from all
        liabilities to which I have agreed to above.
      </Text>
      <HStack pt={4} spacing={6}>
        <FormControl width="30%">
          <FormLabel>
            <Text textStyle="buttonSemiBold">
              Full Name{" "}
              <Text
                as="span"
                color="text.critical.100"
                fontSize="xs"
                verticalAlign="super"
              >
                *
              </Text>
            </Text>
          </FormLabel>
          <Input textStyle="bodyRegular" fontFamily="cursive" />
        </FormControl>

        <FormControl width="30%">
          <FormLabel textStyle="buttonSemiBold">
            <Text textStyle="buttonSemiBold">
              Date{" "}
              <Text
                as="span"
                color="text.critical.100"
                fontSize="xs"
                verticalAlign="super"
              >
                *
              </Text>
            </Text>
          </FormLabel>
          <Input textStyle="bodyRegular" type="date" />
        </FormControl>
      </HStack>
    </Box>
  );
};

export default WaiverPage;
