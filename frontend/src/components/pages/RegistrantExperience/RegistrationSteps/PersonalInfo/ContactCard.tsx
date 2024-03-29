import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../../types/PersonalInfoTypes";
import {
  EmergencyContact,
  RegistrantExperienceCamper,
} from "../../../../../types/CamperTypes";
import RequiredAsterisk from "../../../../common/RequiredAsterisk";
import {
  checkEmail,
  checkFirstName,
  checkLastName,
  checkPhoneNumber,
  checkRelationToCamper,
} from "./personalInfoReducer";
import { FormQuestion } from "../../../../../types/CampsTypes";
import MultipleChoiceGroup from "../QuestionGroups/MultipleChoiceGroup";
import MultiselectGroup from "../QuestionGroups/MultiselectGroup";
import TextInputGroup from "../QuestionGroups/TextInputGroup";

type ContactCardProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  contact: EmergencyContact;
  contactIndex: number;
  camper: RegistrantExperienceCamper;
  dispatchPersonalInfoAction: (action: PersonalInfoReducerDispatch) => void;
  emergencyContactQuestions: FormQuestion[];
};

const ContactCard = ({
  nextBtnRef,
  camper,
  contact,
  contactIndex,
  dispatchPersonalInfoAction,
  emergencyContactQuestions,
}: ContactCardProps): React.ReactElement => {
  const mdWrapWidth = emergencyContactQuestions.length > 1 ? "47%" : "100%";

  const handleMultipleChoiceChange = (
    choice: string,
    question: FormQuestion,
  ) => {
    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT_QUESTIONS_RESPONSE,
      question: question.question,
      data: choice,
    });
  };

  const handleSelectionChange = (
    selectionsResponse: string,
    question: FormQuestion,
  ) => {
    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT_QUESTIONS_RESPONSE,
      question: question.question,
      data: selectionsResponse,
    });
  };

  const handleTextChange = (response: string, question: FormQuestion) => {
    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT_QUESTIONS_RESPONSE,
      question: question.question,
      data: response,
    });
  };

  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState<boolean>(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState<boolean>(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);
  const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState<boolean>(
    false,
  );
  const [isRelationInvalid, setIsRelationInvalid] = useState<boolean>(false);

  const [nextClicked, setNextClicked] = useState(false);

  useEffect(() => {
    let nextBtnRefValue: HTMLButtonElement; // Reference to the next step button
    const updateFormErrorMsgs = () => {
      // Check if we're on secondary contact. If so, then we display error messages only if user has started filling secondary contact.
      if (
        contactIndex === 1 &&
        !(
          contact.firstName ||
          contact.lastName ||
          contact.email ||
          contact.phoneNumber ||
          contact.relationshipToCamper
        )
      ) {
        setIsFirstNameInvalid(false);
        setIsLastNameInvalid(false);
        setIsEmailInvalid(false);
        setIsPhoneNumberInvalid(false);
        setIsRelationInvalid(false);
        return;
      }

      if (!checkFirstName(contact.firstName)) setIsFirstNameInvalid(true);
      if (!checkLastName(contact.lastName)) setIsLastNameInvalid(true);
      if (!checkEmail(contact.email)) setIsEmailInvalid(true);
      if (!checkPhoneNumber(contact.phoneNumber)) setIsPhoneNumberInvalid(true);
      if (!checkRelationToCamper(contact.relationshipToCamper))
        setIsRelationInvalid(true);
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
  }, [contact, nextBtnRef, contactIndex]);

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%">
      <Box backgroundColor="#FFFFFF" rounded="xl">
        <Heading textStyle="displayLarge">
          <Text
            py={6}
            px={{ sm: "5", lg: "20" }}
            textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}
          >
            {contactIndex === 0 ? "Primary Contact" : "Secondary Contact"}{" "}
          </Text>
        </Heading>
        <Divider borderColor="border.secondary.100" />
      </Box>

      <Box px={{ sm: "5", lg: "20" }}>
        <Wrap pt="7">
          <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
            <FormControl isInvalid={isFirstNameInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  First Name {contactIndex === 0 && <RequiredAsterisk />}
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.firstName}
                onChange={(event) => {
                  setIsFirstNameInvalid(false);
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "firstName",
                    contactIndex,
                    data: event.target.value,
                  });
                }}
              />
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
            <FormControl isInvalid={isLastNameInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Last Name {contactIndex === 0 && <RequiredAsterisk />}
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.lastName}
                onChange={(event) => {
                  setIsLastNameInvalid(false);
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "lastName",
                    contactIndex,
                    data: event.target.value,
                  });
                }}
              />
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
            <FormControl isInvalid={isEmailInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Email {contactIndex === 0 && <RequiredAsterisk />}
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.email}
                onChange={(event) => {
                  setIsEmailInvalid(false);
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "email",
                    contactIndex,
                    data: event.target.value,
                  });
                }}
              />
              <FormErrorMessage>The provided email is invalid</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "45%", lg: "25%" }}>
            <FormControl isInvalid={isPhoneNumberInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Phone Number {contactIndex === 0 && <RequiredAsterisk />}
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.phoneNumber}
                onChange={(event) => {
                  setIsPhoneNumberInvalid(false);
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "phoneNumber",
                    contactIndex,
                    data: event.target.value,
                  });
                }}
              />
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
        </Wrap>

        <Wrap py={7}>
          <WrapItem width={{ sm: "100%", md: "47%" }}>
            <FormControl isInvalid={isRelationInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Relation To Camper{" "}
                  {contactIndex === 0 && <RequiredAsterisk />}
                </Text>
              </FormLabel>
              <Textarea
                backgroundColor="#FFFFFF"
                value={contact.relationshipToCamper}
                onChange={(event) => {
                  setIsRelationInvalid(false);
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "relationshipToCamper",
                    contactIndex,
                    data: event.target.value,
                  });
                }}
              />
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>

          {contactIndex === 0 &&
            emergencyContactQuestions.map((question) => (
              <WrapItem
                key={`contact_info_question_${question.question}`}
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

export default ContactCard;
