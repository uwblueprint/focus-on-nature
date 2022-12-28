import React, { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInputField,
  NumberInput,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../types/PersonalInfoTypes";
import RequiredAsterisk from "../../../common/RequiredAsterisk";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { checkAge, checkFirstName, checkLastName } from "./personalInfoReducer";

type CamperCardProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  camper: RegistrantExperienceCamper;
  camperId: number;
  setPersonalInfo: (action: PersonalInfoReducerDispatch) => void;
};

const CamperCard = ({
  nextBtnRef,
  camper,
  camperId,
  setPersonalInfo,
}: CamperCardProps): React.ReactElement => {
  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState<boolean>(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState<boolean>(false);
  const [isAgeInvalid, setIsAgeInvalid] = useState<boolean>(false);

  useEffect(() => {
    const updateFormErrorMsgs = () => {
      console.log(
        checkFirstName(camper.firstName),
        checkLastName(camper.lastName),
        checkAge(camper.age),
        camper.firstName,
        !!camper.firstName,
      );
      if (!checkFirstName(camper.firstName)) setIsFirstNameInvalid(true);
      if (!checkLastName(camper.lastName)) setIsLastNameInvalid(true);
      if (!checkAge(camper.age)) setIsAgeInvalid(true);
    };

    if (nextBtnRef && nextBtnRef.current) {
      // Passing the same reference
      nextBtnRef.current.addEventListener("click", updateFormErrorMsgs);
    }

    return () => {
      // Passing the same reference
      if (nextBtnRef && nextBtnRef.current) {
        nextBtnRef.current.removeEventListener("click", updateFormErrorMsgs);
      }
    };
  }, [camper]);

  function AlertDialogExample() {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef(null);

    return (
      <>
        <Button
          color="text.critical.100"
          variant="outline"
          onClick={onOpen}
          colorScheme="blue"
        >
          <DeleteIcon />
          <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }} pl={3}>
            Remove
          </Text>
        </Button>

        <AlertDialog
          isCentered
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay backgroundColor="overlay.dark.50">
            <AlertDialogContent>
              <AlertDialogHeader fontStyle="heading">
                Remove Camper
              </AlertDialogHeader>

              <AlertDialogBody>
                <Text textStyle="bodyRegular">
                  Are you sure you want to remove this camper from the
                  registration form? <br />
                  <br />
                  <Text as="span" textStyle="bodyBold">
                    Note: this action is irreversible.{" "}
                  </Text>
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setPersonalInfo({
                      type: PersonalInfoActions.DELETE_CAMPER,
                      camperId,
                    });
                    toast({
                      description: `${camper.firstName} ${camper.lastName} has been successfully removed`,
                      status: "success",
                      duration: 6000,
                      isClosable: true,
                      variant: "subtle",
                    });
                    onClose();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%">
      <Box backgroundColor="#FFFFFF" rounded="xl">
        <Heading textStyle="displayLarge">
          <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
            <Text textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}>
              Camper #{camperId + 1}
            </Text>
            <Spacer />
            {camperId > 0 ? AlertDialogExample() : null}
          </Flex>
        </Heading>
        <Divider borderColor="border.secondary.100" />
      </Box>
      <Box px={{ sm: "5", lg: "20" }}>
        <Wrap pt={7}>
          <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
            <FormControl isInvalid={isFirstNameInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  First Name{" "}
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
                backgroundColor="#FFFFFF"
                value={camper.firstName}
                onChange={(event) => {
                  setIsFirstNameInvalid(false);
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "firstName",
                    camperId,
                    data: event.target.value,
                  });
                }}
              />
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
            <FormControl isInvalid={isLastNameInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Last Name{" "}
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
                backgroundColor="#FFFFFF"
                value={camper.lastName}
                onChange={(event) => {
                  setIsLastNameInvalid(false);
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "lastName",
                    camperId,
                    data: event.target.value,
                  });
                }}
              />
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
            <FormControl isInvalid={isAgeInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Age{" "}
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
              <NumberInput precision={0} defaultValue={camper.age}>
                <NumberInputField
                  backgroundColor="#FFFFFF"
                  onChange={(event) => {
                    setIsAgeInvalid(false);
                    setPersonalInfo({
                      type: PersonalInfoActions.UPDATE_CAMPER,
                      field: "age",
                      camperId,
                      data: parseInt(event.target.value, 10),
                    });
                  }}
                />
                <FormErrorMessage>
                  Camper age must be between 7 - 10 years old
                </FormErrorMessage>
              </NumberInput>
            </FormControl>
          </WrapItem>
        </Wrap>

        <Wrap py={7}>
          <WrapItem width={{ sm: "100%", md: "47%" }}>
            <FormControl>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Allergies
                </Text>
                <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>
                  Please list any allergies the camper has{" "}
                </Text>
              </FormLabel>

              <Textarea
                backgroundColor="#FFFFFF"
                value={camper.allergies ? camper.allergies : ""}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "allergies",
                    camperId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "47%" }}>
            <FormControl>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Special Needs
                </Text>
                <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>
                  Please list any special needs the camper has{" "}
                </Text>
              </FormLabel>

              <Textarea
                backgroundColor="#FFFFFF"
                value={camper.specialNeeds ? camper.specialNeeds : ""}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "specialNeeds",
                    camperId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  );
};

export default CamperCard;
