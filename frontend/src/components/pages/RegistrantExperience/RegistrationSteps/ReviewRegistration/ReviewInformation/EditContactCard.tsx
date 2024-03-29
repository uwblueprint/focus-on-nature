import React, { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Spacer,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../../../types/PersonalInfoTypes";
import {
  EmergencyContact,
  RegistrantExperienceCamper,
} from "../../../../../../types/CamperTypes";
import {
  checkEmail,
  checkFirstName,
  checkLastName,
  checkPhoneNumber,
  checkRelationToCamper,
} from "../../../../../common/personalInfoRegistration/personalInfoReducerInterface";
import EditFormLabel from "./EditFormLabel";
import EditCardFooter from "./EditCardFooter";
import EditCardHeader from "./EditCardHeader";
import { FormQuestion } from "../../../../../../types/CampsTypes";
import TextInputGroup from "../../QuestionGroups/TextInputGroup";
import MultiselectGroup from "../../QuestionGroups/MultiselectGroup";
import MultipleChoiceGroup from "../../QuestionGroups/MultipleChoiceGroup";
import { checkAdditionalQuestionsAnsweredSingleCamper } from "../../AdditionalInfo/additionalInfoReducer";

type EditContactCardProps = {
  camper: RegistrantExperienceCamper;
  contact: EmergencyContact;
  contactIndex: number;
  dispatchPersonalInfoAction: (action: PersonalInfoReducerDispatch) => void;
  emergencyContactQuestions: FormQuestion[];
  isEditing: number;
  setIsEditing: React.Dispatch<React.SetStateAction<number>>;
};

const EditContactCard = ({
  camper,
  contact,
  contactIndex,
  dispatchPersonalInfoAction,
  emergencyContactQuestions,
  isEditing,
  setIsEditing,
}: EditContactCardProps): React.ReactElement => {
  const mdWrapWidth = emergencyContactQuestions.length > 1 ? "47%" : "100%";
  const [updateMemo, setUpdateMemo] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialContact: EmergencyContact = useMemo(() => contact, [updateMemo]);
  const initialCamperFormResponses = useMemo(
    () =>
      camper.formResponses ? Object.fromEntries(camper.formResponses) : {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateMemo],
  );

  const [editingIndividual, setEditingIndividual] = useState(false);

  const setEditing = (state: boolean) => {
    setEditingIndividual(state); // Local editing state.
    setIsEditing(state ? isEditing + 1 : isEditing - 1); // Global editing state.
  };

  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState(false);
  const [isRelationInvalid, setIsRelationInvalid] = useState(false);
  const [save, setSave] = useState(false);

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

  const updateFormErrorMsgs = () => {
    setSave(true);

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
      setEditing(false);
      setUpdateMemo(updateMemo + 1);
      return;
    }

    let valid = true;

    if (!checkFirstName(contact.firstName)) {
      setIsFirstNameInvalid(true);
      valid = false;
    }
    if (!checkLastName(contact.lastName)) {
      setIsLastNameInvalid(true);
      valid = false;
    }
    if (!checkEmail(contact.email)) {
      setIsEmailInvalid(true);
      valid = false;
    }
    if (!checkPhoneNumber(contact.phoneNumber)) {
      setIsPhoneNumberInvalid(true);
      valid = false;
    }
    if (!checkRelationToCamper(contact.relationshipToCamper)) {
      setIsRelationInvalid(true);
      valid = false;
    }

    const requiredQuestions = emergencyContactQuestions
      .filter((question) => question.required)
      .map((question) => question.question);

    const emergencyContactValid = checkAdditionalQuestionsAnsweredSingleCamper(
      camper,
      requiredQuestions,
    );

    if (valid && emergencyContactValid) {
      setEditing(false);
      setUpdateMemo(updateMemo + 1);
    }
  };

  const EditContactOnDelete = () => {
    setIsFirstNameInvalid(false);
    setIsLastNameInvalid(false);
    setIsEmailInvalid(false);
    setIsPhoneNumberInvalid(false);
    setIsRelationInvalid(false);

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT,
      field: "firstName",
      contactIndex,
      data: initialContact.firstName,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT,
      field: "lastName",
      contactIndex,
      data: initialContact.lastName,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT,
      field: "email",
      contactIndex,
      data: initialContact.email,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT,
      field: "phoneNumber",
      contactIndex,
      data: initialContact.phoneNumber,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CONTACT,
      field: "relationshipToCamper",
      contactIndex,
      data: initialContact.relationshipToCamper,
    });

    emergencyContactQuestions.forEach((question) => {
      dispatchPersonalInfoAction({
        type: PersonalInfoActions.UPDATE_CONTACT_QUESTIONS_RESPONSE,
        question: question.question,
        data: initialCamperFormResponses[question.question] || "",
      });
    });

    setEditing(false);
    setSave(false);
  };

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%" mt={2} mb={2}>
      <EditCardHeader
        title={contactIndex === 0 ? "Primary Contact" : "Secondary Contact"}
        onClick={() => setEditing(true)}
        editing={editingIndividual}
      />

      <Box
        zIndex={0}
        backgroundColor="#FFFFFFAA"
        borderRadius="0px 0px 10px 10px"
        _hover={{ cursor: editingIndividual ? "auto" : "not-allowed" }}
      >
        <Box
          zIndex={editingIndividual ? 1 : -1}
          position="relative"
          bg="background.grey.500"
          borderRadius="0px 0px 16px 16px"
        >
          <Box px={{ sm: "5", lg: "20" }}>
            <Wrap pt="7">
              <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
                <FormControl isInvalid={isFirstNameInvalid}>
                  <EditFormLabel
                    title="First Name"
                    required={contactIndex === 0}
                  />
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
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
              <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
                <FormControl isInvalid={isLastNameInvalid}>
                  <EditFormLabel
                    title="Last Name"
                    required={contactIndex === 0}
                  />
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
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
              <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
                <FormControl isInvalid={isEmailInvalid}>
                  <EditFormLabel title="Email" required={contactIndex === 0} />
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
                  <FormErrorMessage>Error validating email</FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
              <WrapItem width={{ sm: "100%", md: "45%", lg: "25%" }}>
                <FormControl isInvalid={isPhoneNumberInvalid}>
                  <EditFormLabel
                    title="Phone Number"
                    required={contactIndex === 0}
                  />
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
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
            </Wrap>

            <Wrap py={7}>
              <WrapItem width={{ sm: "100%", md: "47%" }}>
                <FormControl isInvalid={isRelationInvalid}>
                  <EditFormLabel
                    title="Relation To Camper"
                    required={contactIndex === 0}
                  />
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
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
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
                        nextClicked={save}
                      />
                    )}
                    {question.type === "Multiselect" && (
                      <MultiselectGroup
                        formResponses={camper.formResponses}
                        question={question}
                        handleSelectionChange={handleSelectionChange}
                        nextClicked={save}
                      />
                    )}
                    {question.type === "MultipleChoice" && (
                      <MultipleChoiceGroup
                        formResponses={camper.formResponses}
                        question={question}
                        handleMultipleChoiceChange={handleMultipleChoiceChange}
                        nextClicked={save}
                      />
                    )}
                  </WrapItem>
                ))}
            </Wrap>
          </Box>

          <EditCardFooter
            onDelete={EditContactOnDelete}
            updateFormErrorMsgs={updateFormErrorMsgs}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EditContactCard;
