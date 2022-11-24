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
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import {
  OptionalClauseResponse,
  RequiredClauseResponse,
  WaiverActions,
  WaiverInterface,
} from "./waiverTypes";

interface WaiverPageProps {
  waiverInterface: WaiverInterface;
  waiverDispatch: any;
}

const WaiverPage = ({
  waiverInterface,
  waiverDispatch,
}: WaiverPageProps): React.ReactElement => {
  const optionalClausesJSX: ReactJSXElement[] = Array.from(
    waiverInterface.optionalClauses,
  ).map((clause: OptionalClauseResponse, index: number) => (
    <VStack spacing={6} pt="2" align="stretch" key={index}>
      <Text>{clause.text}</Text>
      <RadioGroup
        onChange={() =>
          waiverDispatch({
            type: WaiverActions.CLICK_OPTIONAL_CLAUSE,
            payload: clause,
          })
        }
        key={index}
        value={String(clause.agreed)}
      >
        <Stack spacing={5} direction="row">
          <Radio value="true" mb="0">
            {/* NOTE!?: I use mb='0' because there's a margin misalignment issue with Radio component */}
            I agree
          </Radio>
          <Radio value="false">
            I{" "}
            <Text as="span" fontWeight="bold">
              do not
            </Text>{" "}
            agree
          </Radio>
        </Stack>
      </RadioGroup>
    </VStack>
  ));

  const requiredClausesJSX: ReactJSXElement[] = Array.from(
    waiverInterface.requiredClauses,
  ).map((clause: RequiredClauseResponse, index: number) => (
    <ListItem key={index}>{clause.text}</ListItem>
  ));

  return (
    <Box>
      <VStack spacing={8} pt="1" align="stretch">
        <Text textStyle="displayXLarge">Camp Registration</Text>
        <Text textStyle="displayLarge">{waiverInterface.campName}</Text>
        <Text textStyle="displayLarge" color="primary.green.100">
          Waiver
        </Text>
        <Text textStyle="displayMedium" fontWeight="bold">
          In consideration of the participation of my child/children, (the
          “child or children“), in the Focus on Nature photography camp/workshop
          and all activities associated therewith,
        </Text>
        <Text fontWeight="bold">
          I, the undersigned parent/guardian of the child/children, agree to the
          following terms and conditions:
        </Text>
      </VStack>

      <VStack spacing={5} pt="10" align="stretch">
        <Text color="primary.green.100" fontWeight="bold">
          Identity and Waiver of Liability
        </Text>

        <OrderedList pl="10">{requiredClausesJSX}</OrderedList>
      </VStack>

      <VStack spacing={5} pt="10" align="stretch">
        <Text fontWeight="bold">
          By clicking the checkbox below, you agree to the terms and conditions
          above.
        </Text>
        <Checkbox
          isChecked={waiverInterface.agreedRequiredClauses}
          onChange={() =>
            waiverDispatch({ type: WaiverActions.ClICK_REQUIRED_CLAUSE })
          }
        >
          I agree to the above identity and liability waiver conditions{" "}
          <Text as="span" color="red">
            *
          </Text>
        </Checkbox>
      </VStack>

      <VStack spacing={5} pt="10" align="stretch">
        <Text color="primary.green.100" fontWeight="bold">
          Additional Clauses
        </Text>
        {optionalClausesJSX}
      </VStack>

      <FormControl pt="9" width="40%">
        <FormLabel fontWeight="bold">Name</FormLabel>
        <Input fontFamily="cursive" />
      </FormControl>

      <FormControl pt="5" width="40%">
        <FormLabel fontWeight="bold">Date</FormLabel>
        <Input />
      </FormControl>
    </Box>
  );
};

export default WaiverPage;
