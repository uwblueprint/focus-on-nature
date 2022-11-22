import React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  StackDivider,
  Stack,
  Checkbox,
  ListItem,
  OrderedList,
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
  const optionalClausesJSX: ReactJSXElement[] = [];
  const requiredClausesJSX: ReactJSXElement[] = [];

  waiverInterface.optionalClauses?.forEach(
    (clause: OptionalClauseResponse, index: number) => {
      optionalClausesJSX.push(
        <Checkbox
          isChecked={clause.agreed}
          onChange={() =>
            waiverDispatch({
              type: WaiverActions.CLICK_OPTIONAL_CLAUSE,
              payload: clause,
            })
          }
          key={index}
        >
          {clause.text}
        </Checkbox>,
      );
    },
  );
  waiverInterface.requiredClauses?.forEach(
    (clause: RequiredClauseResponse, index: number) => {
      requiredClausesJSX.push(<ListItem key={index}>{clause.text}</ListItem>);
    },
  );

  return (
    <Box>
      <VStack spacing={8} pt="1" align="stretch">
        <Text textStyle="displayXLarge">Camp Registration</Text>
        <Text textStyle="displayLarge">Guelph Summer Camp 2022</Text>
        <Text textStyle="displayLarge" color="primary.green.100">
          Waiver
        </Text>
        <Text textStyle="displayMedium" fontWeight="bold">
          In consideration of the participation of my child/children, (the
          “child or children“), in the Focus on Nature photography
          camp/workshop and all activities associated therewith,
        </Text>
        <Text fontWeight="bold">
          I, the undersigned parent/guardian of the child/children, agree to
          the following terms and conditions:
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
          By clicking the checkbox below, you agree to the terms and
          conditions above.
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
    </Box>
  );
};

export default WaiverPage;
