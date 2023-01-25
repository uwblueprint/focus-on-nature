import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text,
  FormErrorMessage,
  Grid,
  GridItem,
  Textarea,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import RequiredAsterisk from "../RequiredAsterisk";

type PersonalinfoCardLayout = {
  templateColumns: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  gap: {
    sm?: string;
    md?: string;
    lg?: string;
  };
};

type PersonalinfoInputLayout = {
  value: string;
  field: string;
  heading: string;
  required: boolean;
  dispatchAction: (eventValue: string) => void;
  type: CamperCardInputTypes;
  colSpan?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  description?: string;
  errorInfo?: ErrorMessageInfo;
};

type ErrorMessageInfo = {
  errorMessage: string;
  isInvalid: boolean;
};

export enum CamperCardInputTypes {
  INPUT,
  NUMBERINPUT,
  TEXTAREA,
}

type RegistrantionCardProps = {
  cardTitle: string;
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  deleteCardButton?: JSX.Element;
  camperCardLayout: PersonalinfoCardLayout;
  fields: PersonalinfoInputLayout[];
};

const PersonalInfoCard = ({
  nextBtnRef,
  cardTitle,
  camperCardLayout,
  deleteCardButton,
  fields,
}: RegistrantionCardProps): React.ReactElement => {
  const [raiseErrorStates, setRaiseErrorStates] = useState(
    new Array(fields.length).fill(false),
  ); // Holds the bools for knowing when to raise an error on input fields
  useEffect(() => {
    let submitBtnRefValue: HTMLButtonElement; // Reference to the next step button
    const updateFormErrorMsgs = () => {
      setRaiseErrorStates(
        fields.map((field) =>
          field.errorInfo ? field.errorInfo.isInvalid : false,
        ),
      );
    };

    if (nextBtnRef && nextBtnRef.current) {
      submitBtnRefValue = nextBtnRef.current;
      submitBtnRefValue.addEventListener("click", updateFormErrorMsgs);
    }

    return () => {
      if (submitBtnRefValue) {
        submitBtnRefValue.removeEventListener("click", updateFormErrorMsgs);
      }
    };
  }, [nextBtnRef, camperCardLayout, fields]);

  function getInputJSX(
    field: PersonalinfoInputLayout,
    inputIndex: number,
    value: string,
  ) {
    switch (field.type) {
      case CamperCardInputTypes.INPUT:
        return (
          <Input
            backgroundColor="#FFFFFF"
            value={value}
            onChange={(event) => {
              setRaiseErrorStates((oldRaiseErrorStates) => {
                return oldRaiseErrorStates.map((state, index) =>
                  index === inputIndex ? false : state,
                );
              });
              field.dispatchAction(event.target.value);
            }}
          />
        );
      case CamperCardInputTypes.TEXTAREA:
        return (
          <Textarea
            backgroundColor="#FFFFFF"
            value={value}
            onChange={(event) => {
              setRaiseErrorStates((oldRaiseErrorStates) => {
                return oldRaiseErrorStates.map((state, index) =>
                  index === inputIndex ? false : state,
                );
              });
              field.dispatchAction(event.target.value);
            }}
          />
        );
      case CamperCardInputTypes.NUMBERINPUT:
        return (
          <NumberInput precision={0} defaultValue={value}>
            <NumberInputField
              backgroundColor="#FFFFFF"
              onChange={(event) => {
                setRaiseErrorStates((oldRaiseErrorStates) => {
                  return oldRaiseErrorStates.map((state, index) =>
                    index === inputIndex ? false : state,
                  );
                });
                field.dispatchAction(event.target.value);
              }}
            />
          </NumberInput>
        );
      default:
        return null;
    }
  }

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%" pb={4}>
      <Box backgroundColor="#FFFFFF" rounded="xl">
        <Heading textStyle="displayLarge">
          <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
            <Text textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}>
              {cardTitle}
            </Text>
            <Spacer />
            {deleteCardButton}
          </Flex>
        </Heading>
        <Divider borderColor="border.secondary.100" />
      </Box>
      <Box px={{ sm: "5", lg: "20" }} py={3}>
        <Grid
          templateColumns={camperCardLayout.templateColumns}
          gap={camperCardLayout.gap}
        >
          {fields.map((field, inputIndex) => (
            <GridItem key={inputIndex} colSpan={field.colSpan}>
              <FormControl isInvalid={raiseErrorStates[inputIndex]}>
                <FormLabel>
                  <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                    {`${field.heading} `}
                    <Text
                      as="span"
                      color="text.critical.100"
                      fontSize="xs"
                      verticalAlign="super"
                    >
                      {field.required ? <RequiredAsterisk /> : undefined}
                    </Text>
                  </Text>
                  <Text
                    textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}
                  >
                    {`${field.description ? field.description : ""} `}
                  </Text>
                </FormLabel>
                {getInputJSX(field, inputIndex, field.value)}
                <FormErrorMessage>
                  {field.errorInfo?.errorMessage}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PersonalInfoCard;
