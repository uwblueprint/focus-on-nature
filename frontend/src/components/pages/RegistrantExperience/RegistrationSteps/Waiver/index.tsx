import React, { useEffect, useState } from "react";
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
  FormErrorMessage,
} from "@chakra-ui/react";
import RequiredAsterisk from "../../../../common/RequiredAsterisk";
import {
  OptionalClauseResponse,
  RequiredClauseResponse,
  WaiverActions,
  WaiverInterface,
  WaiverReducerDispatch,
} from "../../../../../types/waiverTypes";
import {
  checkDate,
  checkName,
  checkOptionalClause,
  checkRequiredClauses,
} from "./WaiverReducer";

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
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  waiverInterface: WaiverInterface;
  waiverDispatch: React.Dispatch<WaiverReducerDispatch>;
  campName: string;
}

const WaiverPage = ({
  nextBtnRef,
  waiverInterface,
  waiverDispatch,
  campName,
}: WaiverPageProps): React.ReactElement => {
  const [isNameInvalid, setIsNameInvalid] = useState<boolean>(false);
  const [isDateInvalid, setIsDateInvalid] = useState<boolean>(false);
  const [
    isRequiredClauseInvalid,
    setIsRequriedClauseInvalid,
  ] = useState<boolean>(false);
  const [isOptionalClausesInvalid, setIsOptionalClausesInvalid] = useState<
    boolean[]
  >([]);

  useEffect(() => {
    // update the size of the isOptionalClausesInvalid accordingly if clauses are added or deleted
    setIsOptionalClausesInvalid(
      new Array(waiverInterface.optionalClauses.length).fill(false),
    );
  }, [waiverInterface.optionalClauses.length]);

  useEffect(() => {
    let nextBtnRefValue: HTMLButtonElement; // Reference to the next step button
    const updateFormErrorMsgs = () => {
      if (!checkName(waiverInterface.name)) setIsNameInvalid(true);
      if (!checkDate(waiverInterface.date)) setIsDateInvalid(true);
      if (!checkRequiredClauses(waiverInterface.agreedRequiredClauses)) setIsRequriedClauseInvalid(true);

      const newIsOptionalClausesInvalid: boolean[] = Array.from(
        waiverInterface.optionalClauses,
        (optionalClauseResponse) => {
          return !checkOptionalClause(optionalClauseResponse);
        },
      );
      setIsOptionalClausesInvalid(newIsOptionalClausesInvalid);
    };

    if (nextBtnRef && nextBtnRef.current) {
      nextBtnRefValue = nextBtnRef.current;
      nextBtnRefValue.addEventListener("click", updateFormErrorMsgs);
    }

    return () => {
      if (nextBtnRefValue) {
        nextBtnRefValue.removeEventListener("click", updateFormErrorMsgs);
      }
    };
  }, [waiverInterface, nextBtnRef]);

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
          and all activities associated therewith, I, the undersigned
          parent/guardian of the child/children, agree to the following terms
          and conditions:
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
        <FormControl isInvalid={isRequiredClauseInvalid}>
          <Checkbox
            isChecked={waiverInterface.agreedRequiredClauses}
            onChange={() => {
              setIsRequriedClauseInvalid(false);
              waiverDispatch({ type: WaiverActions.ClICK_REQUIRED_CLAUSE });
            }}
          >
            <Text textStyle={bodyTextStyles}>
              I agree to the above identity and liability waiver conditions{" "}
              <RequiredAsterisk />
            </Text>
          </Checkbox>
          <FormErrorMessage />
        </FormControl>
      </VStack>

      <Divider borderColor="border.secondary.100" />

      <VStack spacing={5} my={marginBetweenSections} align="stretch">
        <Text color="primary.green.100" textStyle={headingTextStyles}>
          Additional Clauses
        </Text>
        {waiverInterface.optionalClauses.map(
          (clause: OptionalClauseResponse, index: number) => (
            <VStack spacing={6} pt={2} align="stretch" key={index}>
              <Text textStyle={bodyTextStyles}>
                {clause.text}
                <RequiredAsterisk />
              </Text>
              <FormControl isInvalid={isOptionalClausesInvalid[index]}>
                <RadioGroup
                  onChange={(value) => {
                    setIsOptionalClausesInvalid(
                      Array.from(isOptionalClausesInvalid, (val, i) => {
                        return index === i ? false : val;
                      }),
                    );
                    waiverDispatch({
                      type: WaiverActions.CLICK_OPTIONAL_CLAUSE,
                      agreed: value === "true",
                      optionalClauseId: index,
                    });
                  }}
                  key={index}
                  value={String(clause.optionSelected ? clause.agreed : null)}
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
                <FormErrorMessage>Pleast select one option.</FormErrorMessage>
              </FormControl>
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
        <FormControl minWidth="250px" width="30vw" isInvalid={isNameInvalid}>
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
            onChange={(event) => {
              setIsNameInvalid(false);
              waiverDispatch({
                type: WaiverActions.WRITE_NAME,
                name: event.target.value,
              });
            }}
          />
          <FormErrorMessage>Please type your name above.</FormErrorMessage>
        </FormControl>

        <FormControl
          minWidth="250px"
          width="30vw"
          pb={3}
          isInvalid={isDateInvalid}
        >
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
            onChange={(event) => {
              setIsDateInvalid(false);
              waiverDispatch({
                type: WaiverActions.WRITE_DATE,
                date: event.target.value,
              });
            }}
          />
          <FormErrorMessage>Please select a valid date.</FormErrorMessage>
        </FormControl>
      </Wrap>
    </Box>
  );
};

export default WaiverPage;
