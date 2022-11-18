import React from "react";

import {
  Box,
  Grid,
  GridItem,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";

import { CreateFormQuestion, FormQuestion } from "../../../../types/CampsTypes";
import { getTextFromQuestionType } from "../../../../utils/CampUtils";
import RequiredTag from "../../../common/camps/RequiredTag";
import DeleteCustomQuestionModal from "./DeleteCustomQuestionModal";
import AddQuestionModal from "../../../common/formQuestions/AddQuestionModal/index";

type RegistrationQuestionCardProps = {
  question: FormQuestion | CreateFormQuestion;
  questionNumber: number;
  viewOnly: boolean;
  onDeleteCustomQuestion?: (questionToBeDeleted: CreateFormQuestion) => void;
  onEditCustomQuestion?: (
    oldQuestion: CreateFormQuestion,
    newQuestion: CreateFormQuestion,
  ) => void;
};

const RegistrationQuestionCard = ({
  question,
  questionNumber,
  viewOnly,
  onDeleteCustomQuestion,
  onEditCustomQuestion,
}: RegistrationQuestionCardProps): React.ReactElement => {
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

  return (
    <>
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
      <Box
        backgroundColor="background.grey.200"
        marginBottom="2"
        borderRadius="5"
      >
        <Grid
          templateColumns="repeat(10, 1fr)"
          templateRows="repeat(1, 1fr)"
          height="80px"
          backgroundColor="background.grey.200"
          borderRadius="2px"
          alignItems="center"
        >
          <GridItem rowSpan={1} colSpan={1} paddingLeft="40px">
            <Text fontSize="2xl" color="primary.green.100">
              {questionNumber}.
            </Text>
          </GridItem>

          {viewOnly ? (
            <>
              <GridItem rowSpan={1} colSpan={8} paddingLeft="10px">
                <HStack
                  justifySelf="baseline"
                  alignSelf="baseline"
                  alignContent="baseline"
                >
                  <LockIcon width="20px" />
                  <Text fontSize="large">{question.question}</Text>
                </HStack>
                <Text fontSize="sm" color="text.grey.500">
                  {getTextFromQuestionType(question.type)}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <RequiredTag />
              </GridItem>
            </>
          ) : (
            <>
              <GridItem rowSpan={1} colSpan={7} paddingLeft="10px">
                <Text fontSize="large">{question.question}</Text>
                <Text fontSize="sm" color="text.grey.500">
                  {getTextFromQuestionType(question.type)}
                </Text>
              </GridItem>

              <GridItem rowSpan={1} colSpan={1}>
                {question.required && <RequiredTag />}
              </GridItem>

              <GridItem rowSpan={1} colSpan={1}>
                <HStack
                  spacing="0px"
                  alignItems="center"
                  justifyContent="center"
                  pr={10}
                >
                  <Text
                    pr={3}
                    textStyle="buttonSemiBold"
                    _hover={{ cursor: "pointer" }}
                    onClick={onEditCustomQuestionOpen}
                    color="text.success.100"
                  >
                    Edit
                  </Text>
                  <Text
                    pl={3}
                    textStyle="buttonSemiBold"
                    _hover={{ cursor: "pointer" }}
                    onClick={onDeleteCustomQuestionOpen}
                    color="text.critical.100"
                  >
                    Delete
                  </Text>
                </HStack>
              </GridItem>
            </>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default RegistrationQuestionCard;
