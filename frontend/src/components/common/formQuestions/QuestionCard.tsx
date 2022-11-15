import React from "react";

import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react";

import { FormQuestion } from "../../../types/CampsTypes";
import RequiredTag from "../camps/RequiredTag";
import { getTextFromQuestionType } from "../../../utils/CampUtils";

type QuestionCardProps = {
  question: FormQuestion;
  viewOnly: boolean;
};

const QuestionCard = ({
  question,
  viewOnly,
}: QuestionCardProps): React.ReactElement => {
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
              //   onClick={editModalOnOpen}
              color="text.success.100"
            >
              Edit
            </Text>
          )}
          {!viewOnly && (
            <Text
              textStyle="buttonSemiBold"
              _hover={{ cursor: "pointer" }}
              //   onClick={deleteModalOnOpen}
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
