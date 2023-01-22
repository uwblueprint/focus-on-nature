import React, { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
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
} from "../../../../../types/PersonalInfoTypes";
import RequiredAsterisk from "../../../../common/RequiredAsterisk";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { checkAge, checkFirstName, checkLastName } from "./personalInfoReducer";
import DeleteModal from "../../../../common/DeleteModal";
import { CampResponse, FormQuestion } from "../../../../../types/CampsTypes";
import MultipleChoiceGroup from "../QuestionGroups/MultipleChoiceGroup";
import MultiselectGroup from "../QuestionGroups/MultiselectGroup";
import TextInputGroup from "../QuestionGroups/TextInputGroup";

type CamperCardProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  camper: RegistrantExperienceCamper;
  camperIndex: number;
  camp: CampResponse;
  dispatchPersonalInfoAction: (action: PersonalInfoReducerDispatch) => void;
  personalInfoQuestions: FormQuestion[];
};

const CamperCard = ({
  nextBtnRef,
  camper,
  camperIndex,
  dispatchPersonalInfoAction,
  camp,
  personalInfoQuestions,
}: CamperCardProps): React.ReactElement => {
  const mdWrapWidth = personalInfoQuestions.length > 1 ? "47%" : "100%";

  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState<boolean>(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState<boolean>(false);
  const [isAgeInvalid, setIsAgeInvalid] = useState<boolean>(false);

  const [nextClicked, setNextClicked] = useState(false);

  const handleMultipleChoiceChange = (
    choice: string,
    question: FormQuestion,
  ) => {
    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: choice,
    });
  };

  const handleSelectionChange = (
    selectionsResponse: string,
    question: FormQuestion,
  ) => {
    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: selectionsResponse,
    });
  };

  const handleTextChange = (response: string, question: FormQuestion) => {
    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: response,
    });
  };

  useEffect(() => {
    let nextBtnRefValue: HTMLButtonElement; // Reference to the next step button
    const updateFormErrorMsgs = () => {
      if (!checkFirstName(camper.firstName)) setIsFirstNameInvalid(true);
      if (!checkLastName(camper.lastName)) setIsLastNameInvalid(true);
      if (!checkAge(camper.age, camp.ageUpper, camp.ageLower))
        setIsAgeInvalid(true);
      setNextClicked(true);
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
  }, [camper, nextBtnRef, camp.ageLower, camp.ageUpper]);

  function DeleteRegistrantConfirmationModal() {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const deleteCamperModal = DeleteModal({
      title: "Remove Camper",
      bodyText:
        "Are you sure you want to remove this camper from the registration form?",
      bodyNote: "Note: this action is irreversible.",
      buttonLabel: "Remove",
      isOpen,
      onClose,
      onDelete: () => {
        dispatchPersonalInfoAction({
          type: PersonalInfoActions.DELETE_CAMPER,
          camperIndex,
        });
        toast({
          description: `${camper.firstName} ${camper.lastName} has been successfully removed`,
          status: "success",
          duration: 3000,
          isClosable: false,
          variant: "subtle",
        });
        onClose();
      },
    });

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
        {deleteCamperModal}
      </>
    );
  }

  return (
    <Box
      boxShadow="lg"
      rounded="xl"
      borderWidth={1}
      width="100%"
      backgroundColor="background.grey.500"
    >
      <Box backgroundColor="background.white.100" rounded="xl">
        <Heading textStyle="displayLarge">
          <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
            <Text textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}>
              Camper #{camperIndex + 1}
            </Text>
            <Spacer />
            {camperIndex > 0 ? DeleteRegistrantConfirmationModal() : null}
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
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "firstName",
                    camperIndex,
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
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "lastName",
                    camperIndex,
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
              <NumberInput precision={0} value={camper.age || ""}>
                <NumberInputField
                  backgroundColor="#FFFFFF"
                  onChange={(event) => {
                    const age = parseInt(event.target.value, 10);
                    // Only show invalid status if there is some value entered.
                    // This is not a binding source of truth; the actual validation
                    // occurs in `checkAge` in the `personalInfoReducer`.
                    setIsAgeInvalid(
                      !(
                        event.target.value === "" ||
                        (age >= camp.ageLower && age <= camp.ageUpper)
                      ),
                    );

                    dispatchPersonalInfoAction({
                      type: PersonalInfoActions.UPDATE_CAMPER,
                      field: "age",
                      camperIndex,
                      data: age,
                    });
                  }}
                />
                <FormErrorMessage>
                  Camper age must be between {camp.ageLower} - {camp.ageUpper}{" "}
                  years old
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
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "allergies",
                    camperIndex,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
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
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "specialNeeds",
                    camperIndex,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          {personalInfoQuestions.map((question) => (
            <WrapItem
              key={`personal_info_question_${question.question}`}
              width={{ sm: "100%", md: mdWrapWidth }}
            >
              {question.type === "Text" && (
                <TextInputGroup
                  formResponses={camper.formResponses}
                  question={question}
                  handleTextChange={handleTextChange}
                  nextClicked={nextClicked}
                />
              )}
              {question.type === "Multiselect" && (
                <MultiselectGroup
                  formResponses={camper.formResponses}
                  question={question}
                  handleSelectionChange={handleSelectionChange}
                  nextClicked={nextClicked}
                />
              )}
              {question.type === "MultipleChoice" && (
                <MultipleChoiceGroup
                  formResponses={camper.formResponses}
                  question={question}
                  handleMultipleChoiceChange={handleMultipleChoiceChange}
                  nextClicked={nextClicked}
                />
              )}
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </Box>
  );
};

export default CamperCard;
