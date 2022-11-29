import React, { useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Checkbox,
  ListItem,
  OrderedList,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Input,
  Divider,
  HStack,
  Wrap,
} from "@chakra-ui/react";
import RequiredAsterisk from "../../../common/RequiredAsterisk";
import {
  OptionalClauseResponse,
  RequiredClauseResponse,
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../../types/waiverTypes";

interface WaiverPageProps {
  waiverInterface: WaiverInterface;
  waiverDispatch: React.Dispatch<WaiverReducerDispatch>;
}

const WaiverPage = ({
  waiverInterface,
  waiverDispatch,
}: WaiverPageProps): React.ReactElement => {

  useEffect(() => {
    return function cleanup() {
      // Reset the wroteName and wroteDate which resets waiverCompleted
      waiverDispatch({
        type: WaiverActions.WRITE_NAME,
        name: "",
      })
      waiverDispatch({
        type: WaiverActions.WRITE_DATE,
        date: "",
      })
    }
  }, [])

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
            <RequiredAsterisk />
          </Text>
        </Checkbox>
      </VStack>
      <Divider py={4} borderColor="border.secondary.100" />
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
                <HStack spacing={5}>
                  <Radio value="true" mb={0}>
                    {/* NOTE!?: I use mb='0' because there's a margin misalignment issue with Radio component */}
                    <Text textStyle="bodyRegular">I agree</Text>
                  </Radio>
                  <Radio value="false">
                    <Text textStyle="bodyRegular">
                      I{" "}
                      <Text as="span" textStyle="bodyBold">
                        do not
                      </Text>{" "}
                      agree
                    </Text>
                  </Radio>
                </HStack>
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
        discharge Focus on Nature, its employees, and volunteers from all
        liabilities to which I have agreed to above.
      </Text>
      <Wrap pt={4} spacing={6}>
        <FormControl minWidth="250px" width="30vw">
          <FormLabel>
            <Text textStyle="buttonSemiBold">
              Full Name{" "}
              <Text
                as="span"
                color="text.critical.100"
                fontSize="xs"
                verticalAlign="super"
              >
                <RequiredAsterisk />
              </Text>
            </Text>
          </FormLabel>
          <Input
            textStyle="bodyRegular"
            fontFamily="cursive"
            onChange={(event) =>
              waiverDispatch({
                type: WaiverActions.WRITE_NAME,
                name: event.target.value,
              })
            }
          />
        </FormControl>

        <FormControl minWidth="250px" width="30vw">
          <FormLabel textStyle="buttonSemiBold">
            <Text textStyle="buttonSemiBold">
              Date{" "}
              <Text
                as="span"
                color="text.critical.100"
                fontSize="xs"
                verticalAlign="super"
              >
                <RequiredAsterisk />
              </Text>
            </Text>
          </FormLabel>
          <Input
            textStyle="bodyRegular"
            type="date"
            onChange={(event) =>
              waiverDispatch({
                type: WaiverActions.WRITE_DATE,
                date: event.target.value,
              })
            }
          />
        </FormControl>
      </Wrap>
    </Box>
  );
};

export default WaiverPage;
