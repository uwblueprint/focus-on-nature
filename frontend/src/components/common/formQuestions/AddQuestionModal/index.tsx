import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  Input,
  FormErrorMessage,
  ModalFooter,
  HStack,
  Button,
  Checkbox,
  Box,
} from "@chakra-ui/react";
import {
  CreateFormQuestionRequest,
  FormQuestion,
  QuestionCategory,
  QuestionType,
} from "../../../../types/CampsTypes";
import QuestionOptionSection from "./QuestionOptionSection";

type AddQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (formQuestion: CreateFormQuestionRequest) => void;
  onEdit?: (
    oldQuestion: FormQuestion,
    newQuestion: CreateFormQuestionRequest,
  ) => void;
  questionToBeEdited?: FormQuestion;
  editing?: boolean;
  isFormTemplatePage?: boolean;
};

enum OptionErrorStatus {
  NO_OPTION = "Options cannot be empty",
  AT_LEAST_ONE = "You must enter at least 1 option",
  AT_LEAST_TWO = "You must enter at least 2 options",
  NO_DUPLICATES = "Duplicate options are not allowed",
  VALID = ""
}

const AddQuestionModal = ({
  isOpen,
  onClose,
  onSave,
  onEdit,
  questionToBeEdited,
  editing = false,
  isFormTemplatePage = false,
}: AddQuestionModalProps): React.ReactElement => {
  const [question, setQuestion] = useState<string>("");
  const [questionCategory, setQuestionCategory] = useState<string>(
    "PersonalInfo",
  );
  const [questionType, setQuestionType] = useState<string>("Text");
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [isRequiredQuestion, setIsRequiredQuestion] = useState<boolean>(false);
  const [questionOptions, setQuestionOptions] = useState<Array<string>>([]);

  const [isQuestionInvalid, setIsQuestionInvalid] = useState<boolean>(false);
  const [
    isQuestionOptionsInvalid,
    setIsQuestionOptionsInvalid,
  ] = useState<OptionErrorStatus>(OptionErrorStatus.VALID);

  const setDefaultState = () => {
    if (editing && questionToBeEdited) {
      setQuestion(questionToBeEdited.question);
      setQuestionCategory(questionToBeEdited.category);
      setQuestionType(questionToBeEdited.type);
      setQuestionDescription(
        questionToBeEdited.description === undefined
          ? ""
          : questionToBeEdited.description,
      );
      setIsRequiredQuestion(questionToBeEdited.required);
      setQuestionOptions(
        questionToBeEdited.options === undefined
          ? []
          : [...questionToBeEdited.options],
      );
      setIsQuestionInvalid(false);
      setIsQuestionOptionsInvalid(OptionErrorStatus.VALID);
    } else {
      setQuestion("");
      setQuestionCategory("PersonalInfo");
      setQuestionType("Text");
      setQuestionDescription("");
      setIsRequiredQuestion(false);
      setQuestionOptions([]);
      setIsQuestionInvalid(false);
      setIsQuestionOptionsInvalid(OptionErrorStatus.VALID);
    }
  };

  useEffect(() => {
    setDefaultState();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => {
    setDefaultState();
    onClose();
  };

  const onSaveQuestion = () => {
    setIsQuestionInvalid(false);
    setIsQuestionOptionsInvalid(OptionErrorStatus.VALID);

    if (question === "") {
      setIsQuestionInvalid(true);
      return;
    }

    if (
      questionType === "MultipleChoice" &&
      (questionOptions.length < 2 || !questionOptions.length)
    ) {
      setIsQuestionOptionsInvalid(OptionErrorStatus.AT_LEAST_TWO);
      return;
    }

    if (
      questionType === "Multiselect" &&
      ((questionOptions.length === 1 && questionOptions[0] === "") ||
        !questionOptions.length)
    ) {
      setIsQuestionOptionsInvalid(OptionErrorStatus.AT_LEAST_ONE);
      return;
    }

    if (questionType !== "Text") {
      if (
        questionOptions.some((option: string) => {
          return !option.replace(/\s/g, "").length;
        })
      ) {
        setIsQuestionOptionsInvalid(OptionErrorStatus.NO_OPTION);
        return;
      }
    }

    if (questionType !== "Text" && questionOptions.length !== new Set(questionOptions).size) {
      setIsQuestionOptionsInvalid(OptionErrorStatus.NO_DUPLICATES);
      return;
    }

    closeModal();

    const formQuestion: CreateFormQuestionRequest = {
      type: questionType as QuestionType,
      question,
      required: isRequiredQuestion,
      category: questionCategory as QuestionCategory,
    };

    if (questionDescription !== "") {
      formQuestion.description = questionDescription;
    }

    if (questionOptions.length > 0 && questionType !== "Text") {
      formQuestion.options = questionOptions;
    }
    if (editing && questionToBeEdited && onEdit) {
      onEdit(questionToBeEdited, formQuestion);
    } else if (onSave) {
      onSave(formQuestion);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      isCentered
      preserveScrollBarGap
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        minH="632px"
        maxH="632px"
        minW="500px"
        backgroundColor="background.grey.100"
      >
        <ModalHeader paddingTop="40px" marginRight="30px" marginLeft="30px">
          {editing ? "Edit Question" : "Add Question"}
        </ModalHeader>
        <ModalBody marginRight="30px" marginLeft="30px">
          <VStack align="start">
            <FormControl isRequired>
              <FormLabel aria-required>Question Category</FormLabel>
              <Select
                value={questionCategory}
                onChange={(e) => setQuestionCategory(e.target.value)}
              >
                <option value="PersonalInfo">Camper Information</option>
                <option value="EmergencyContact">Emergency Contact</option>
                {!isFormTemplatePage && (
                  <option value="CampSpecific">
                    Camp Specific Information
                  </option>
                )}
              </Select>
            </FormControl>

            <FormControl isRequired isInvalid={isQuestionInvalid}>
              <FormLabel aria-required marginTop="14px">
                Question
              </FormLabel>
              <Input
                placeholder="Enter question here..."
                value={question}
                onChange={(e) => {
                  setIsQuestionInvalid(false);
                  setQuestion(e.target.value);
                }}
              />
              {isQuestionInvalid && (
                <FormErrorMessage>You must enter a question</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              isRequired
              isInvalid={isQuestionOptionsInvalid !== OptionErrorStatus.VALID}
            >
              <FormLabel aria-required marginTop="14px">
                Question Type
              </FormLabel>
              <Select
                value={questionType}
                onChange={(e) => {
                  setIsQuestionOptionsInvalid(OptionErrorStatus.VALID);
                  setQuestionType(e.target.value);
                }}
              >
                <option value="Text">Short answer</option>
                <option value="MultipleChoice">Multiple choice</option>
                <option value="Multiselect">Checkbox</option>
              </Select>
              {isQuestionOptionsInvalid !== OptionErrorStatus.VALID && (
                <FormErrorMessage>
                  {isQuestionOptionsInvalid}
                </FormErrorMessage>
              )}
            </FormControl>

            {questionType !== "Text" && editing && (
              <QuestionOptionSection
                questionType={questionType}
                setOptionsArray={setQuestionOptions}
                optionsToBeEdited={questionToBeEdited?.options}
                editing
              />
            )}

            {questionType !== "Text" && !editing && (
              <QuestionOptionSection
                questionType={questionType}
                setOptionsArray={setQuestionOptions}
              />
            )}

            <FormControl>
              <FormLabel marginTop="14px">Question Description</FormLabel>
              <Input
                placeholder="Enter description here..."
                value={questionDescription}
                onChange={(e) => setQuestionDescription(e.target.value)}
              />
            </FormControl>

            <Box paddingTop="14px">
              <Checkbox
                isChecked={isRequiredQuestion}
                onChange={(e) => {
                  setIsRequiredQuestion(e.target.checked);
                }}
              >
                Required question
              </Checkbox>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter background="background.white.100" paddingLeft="0px">
          <HStack>
            <Button
              borderColor="primary.green.100"
              border="1px"
              color="primary.green.100"
              width="173px"
              height="48px"
              backgroundColor="background.white.100"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              background="primary.green.100"
              color="text.white.100"
              width="173px"
              height="48px"
              onClick={onSaveQuestion}
            >
              Save question
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddQuestionModal;
