import React from "react";
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
import JsPDF from "jspdf";
import RequiredAsterisk from "../../../common/RequiredAsterisk";
import {
  OptionalClauseResponse,
  RequiredClauseResponse,
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../../types/waiverTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";

const bodyTextStyles = {
  sm: "xSmallRegular",
  md: "xSmallRegular",
  lg: "bodyRegular",
};

const boldBodyTextStyles = {
  sm: "xSmallBold",
  md: "xSmallBold",
  lg: "bodyBold",
};

const headingTextStyles = {
  sm: "xSmallBold",
  md: "captionSemiBold",
  lg: "heading",
};

const boldButtonTextStyles = {
  sm: "xSmallBold",
  md: "buttonSemiBold",
  lg: "buttonSemiBold",
};

const marginBetweenSections = { sm: 7, md: 8, lg: 10 };

interface WaiverPageProps {
  waiverInterface: WaiverInterface;
  waiverDispatch: React.Dispatch<WaiverReducerDispatch>;
  campName: string;
}

const WaiverPage = ({
  waiverInterface,
  waiverDispatch,
  campName,
}: WaiverPageProps): React.ReactElement => {
  return (
    <Box>
      <VStack align="stretch">
        <Text
          textStyle={{ sm: "xSmallBold", md: "bodyBold", lg: "displayXLarge" }}
        >
          {campName} Registration
        </Text>
        <Text
          textStyle={{
            sm: "xSmallMedium",
            md: "xSmallBold",
            lg: "displayLarge",
          }}
          color="primary.green.100"
        >
          Waiver
        </Text>
        <Text textStyle={boldButtonTextStyles} mt={6}>
          In consideration of the participation of my child/children, (the
          “child or children“), in the Focus on Nature photography camp/workshop
          and all activities associated therewith, I, the parent/guardian of the
          child/children, agree to the following terms and conditions:
        </Text>
      </VStack>

      <VStack spacing={5} my={marginBetweenSections} align="stretch">
        <Text color="primary.green.100" textStyle={headingTextStyles}>
          Identity and Waiver of Liability
        </Text>

        <OrderedList pl={10} spacing={{ base: 5, sm: 3 }}>
          {waiverInterface.requiredClauses.map(
            (clause: RequiredClauseResponse, index: number) => (
              <ListItem textStyle={bodyTextStyles} key={index}>
                {clause.text}
              </ListItem>
            ),
          )}
        </OrderedList>
      </VStack>

      <VStack spacing={5} my={marginBetweenSections} align="stretch">
        <Text textStyle={headingTextStyles}>
          By clicking the checkbox below, you agree to the terms and conditions
          above.
        </Text>
        <Checkbox
          isChecked={waiverInterface.agreedRequiredClauses}
          onChange={() =>
            waiverDispatch({ type: WaiverActions.ClICK_REQUIRED_CLAUSE })
          }
        >
          <Text textStyle={bodyTextStyles}>
            I agree to the above identity and liability waiver conditions{" "}
            <RequiredAsterisk />
          </Text>
        </Checkbox>
      </VStack>

      <Divider borderColor="border.secondary.100" />

      <VStack spacing={5} my={marginBetweenSections} align="stretch">
        <Text color="primary.green.100" textStyle={headingTextStyles}>
          Additional Clauses
        </Text>
        {waiverInterface.optionalClauses.map(
          (clause: OptionalClauseResponse, index: number) => (
            <VStack spacing={6} pt={2} align="stretch" key={index}>
              <Text textStyle={bodyTextStyles}>{clause.text}</Text>
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
                    <Text textStyle={bodyTextStyles}>I agree</Text>
                  </Radio>
                  <Radio value="false">
                    <Text textStyle={bodyTextStyles}>
                      I{" "}
                      <Text as="span" textStyle={boldBodyTextStyles}>
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
        borderColor="border.secondary.100"
        textStyle={headingTextStyles}
      />

      <Text textStyle={headingTextStyles} mt={marginBetweenSections}>
        By typing my name below, I hereby declare that I fully release and
        discharge Focus on Nature, its employees, and volunteers from all
        liabilities to which I have agreed to above.
      </Text>
      <Wrap pt={4} spacing={{ base: 6, sm: 4 }}>
        <FormControl minWidth="250px" width="30vw">
          <FormLabel>
            <Text textStyle={boldButtonTextStyles}>
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
            textStyle={bodyTextStyles}
            fontFamily="cursive"
            value={waiverInterface.name}
            onChange={(event) =>
              waiverDispatch({
                type: WaiverActions.WRITE_NAME,
                name: event.target.value,
              })
            }
          />
        </FormControl>

        <FormControl minWidth="250px" width="30vw" pb={3}>
          <FormLabel textStyle={boldButtonTextStyles}>
            <Text textStyle={boldButtonTextStyles}>
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
            textStyle={bodyTextStyles}
            type="date"
            value={waiverInterface.date}
            onChange={(event) =>
              waiverDispatch({
                type: WaiverActions.WRITE_DATE,
                date: event.target.value,
              })
            }
          />
        </FormControl>
      </Wrap>
      <button onClick={sendEmail} type="button">
        Send Email PDF
      </button>
    </Box>
  );
};

export default WaiverPage;
