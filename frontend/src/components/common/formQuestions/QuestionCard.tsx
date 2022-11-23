import React from "react";

import {
  Box,
  Flex,
  HStack,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { CreateFormQuestion } from "../../../types/CampsTypes";
import { getTextFromQuestionType } from "../../../utils/CampUtils";
import RequiredTag from "../camps/RequiredTag";
import DeleteCustomQuestionModal from "../../pages/CampCreation/RegistrationForm/DeleteCustomQuestionModal";
import AddQuestionModal from "./AddQuestionModal/index";

type QuestionCardProps = {
  question: CreateFormQuestion;
  viewOnly: boolean;
  onDeleteCustomQuestion?: (questionToBeDeleted: CreateFormQuestion) => void;
  onEditCustomQuestion?: (
    oldQuestion: CreateFormQuestion,
    newQuestion: CreateFormQuestion,
  ) => void;
};

const QuestionCard = ({
  question,
  viewOnly,
  onDeleteCustomQuestion,
  onEditCustomQuestion,
}: QuestionCardProps): React.ReactElement => {
  const {
    isOpen: isDeleteCustomQuestionOpen,
    onOpen: onDeleteCustomQuestionOpen,
    onClose: onDeleteCustomQuestionClose,
  } = useDisclosure();

  const {
    isOpen: isEditCustomQuestionOpen,
    onOpen: onEditCustomQuestionOpen,
    onClose: onEditCustomQuestionClose,
  } = useDisclosure();

  const getQuestionDescription = (): string => {
    let questionDescription: string = getTextFromQuestionType(question.type);

    if (question.type === "MultipleChoice" || question.type === "Multiselect") {
      if (!question.options || question.options.length === 0) {
        return questionDescription;
      }
      questionDescription = `${questionDescription}: ${question.options.join(
        ", ",
      )}`;
    }

    return questionDescription;
  };

  return (
    <Box
      px="32px"
      pt="20px"
      pb="22px"
      bg="background.grey.100"
      my="12px"
      height="fit-content"
    >
      <DeleteCustomQuestionModal
        isOpen={isDeleteCustomQuestionOpen}
        onClose={onDeleteCustomQuestionClose}
        onDelete={onDeleteCustomQuestion}
        question={question}
      />
      <AddQuestionModal
        editing
        isOpen={isEditCustomQuestionOpen}
        onClose={onEditCustomQuestionClose}
        onEdit={onEditCustomQuestion && onEditCustomQuestion}
        questionToBeEdited={question}
      />
      <Flex pb="14px">
        <HStack spacing="20px" fontWeight="bold">
          <Text size="18px">{question.question}</Text>
          {question.required && <RequiredTag />}
        </HStack>
        <Spacer />
        <HStack spacing="20px">
          {!viewOnly && (
            <Text
              textStyle="buttonSemiBold"
              _hover={{ cursor: "pointer" }}
              onClick={onEditCustomQuestionOpen}
              color="text.success.100"
            >
              Edit
            </Text>
          )}
          {!viewOnly && (
            <Text
              textStyle="buttonSemiBold"
              _hover={{ cursor: "pointer" }}
              onClick={onDeleteCustomQuestionOpen}
              color="text.critical.100"
            >
              Delete
            </Text>
          )}
        </HStack>
      </Flex>
      <Text size="14px">{getQuestionDescription()}</Text>
    </Box>
  );
};

export default QuestionCard;
