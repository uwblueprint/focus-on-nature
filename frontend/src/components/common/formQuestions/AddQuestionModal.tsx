import React, { useState } from "react";

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
  IconButton,
  Radio,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  CreateFormQuestion,
  QuestionCategory,
  QuestionType,
} from "../../../types/CampsTypes";

const QuestionOptionSection = ({
  questionType,
  setOptionsArray,
}: {
  questionType: string;
  setOptionsArray: React.Dispatch<React.SetStateAction<string[]>>;
}): React.ReactElement => {
  interface Option {
    option: string;
  }

  const key: keyof Option = "option";

  const [options, setOptions] = useState<Array<Option>>([{ option: "" }]);

  const handleFormChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const data = [...options];
    data[index][key] = e.target.value;
    setOptions(data);
    const optionsArray = data.map((option) => option.option);
    setOptionsArray(optionsArray);
  };

  const removeField = (index: number) => {
    const data = [...options];
    data.splice(index, 1);
    setOptions(data);
    const optionsArray = data.map((option) => option.option);
    setOptionsArray(optionsArray);
  };

  const addInputField = () => {
    const newField = { option: "" };
    setOptions([...options, newField]);
  };

  return (
    <VStack minW="100%" key="options_stack">
      {options.map((option, index) => {
        return (
          <HStack
            key={`${option}_${index}_stack`}
            minW="100%"
            align="start"
            alignItems="center"
          >
            {questionType === "MultipleChoice" && (
              <Radio size="lg" key={`${option}_${index}_radio`} isReadOnly />
            )}

            {questionType === "Multiselect" && (
              <Checkbox
                isReadOnly
                key={`${option}_${index}_checkbox`}
                size="lg"
              />
            )}

            <Input
              key={`${option}_${index}_input`}
              onChange={(e) => handleFormChange(index, e)}
              value={option.option}
            />

            <IconButton
              icon={<DeleteIcon />}
              aria-label="remove option"
              variant="ghost"
              key={`${option}_${index}_delete`}
              maxW="15px"
              onClick={() => removeField(index)}
              isDisabled={options.length <= 1}
            />
          </HStack>
        );
      })}
      <IconButton
        aria-label="add new option"
        icon={<AddIcon />}
        minW="100%"
        maxH="30px"
        onClick={addInputField}
      />
    </VStack>
  );
};

type AddQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formQuestion: CreateFormQuestion) => void;
};

const AddQuestionModal = ({
  isOpen,
  onClose,
  onSave,
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

  const setDefaultState = () => {
    setQuestion("");
    setQuestionCategory("PersonalInfo");
    setQuestionType("Text");
    setQuestionDescription("");
    setIsRequiredQuestion(false);
    setQuestionOptions([]);
    setIsQuestionInvalid(false);
  };

  const closeModal = () => {
    setDefaultState();
    onClose();
  };

  const onSaveQuestion = () => {
    if (question === "") {
      setIsQuestionInvalid(true);
      return;
    }

    const formQuestion: CreateFormQuestion = {
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
    onSave(formQuestion);
    closeModal();
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
          Add Question
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
                <option value="CampSpecific">Camp Specific Information</option>
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

            <FormControl isRequired>
              <FormLabel aria-required marginTop="14px">
                Question Type
              </FormLabel>
              <Select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="Text">Short answer</option>
                <option value="MultipleChoice">Multiple choice</option>
                <option value="Multiselect">Checkbox</option>
              </Select>
            </FormControl>

            {questionType !== "Text" && (
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
                onChange={(e) => setIsRequiredQuestion(e.target.checked)}
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
