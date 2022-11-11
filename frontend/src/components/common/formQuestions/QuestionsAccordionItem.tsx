import React from "react";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";

import { FormQuestion } from "../../../types/CampsTypes";
import QuestionCard from "./QuestionCard";

type QuestionsAccordionItemProps = {
  fixedQuestions: Array<FormQuestion>;
  dynamicQuestions: Array<FormQuestion>;
  accordionTitle: string;
};

const QuestionsAccordionItem = ({
  fixedQuestions,
  dynamicQuestions,
  accordionTitle,
}: QuestionsAccordionItemProps): React.ReactElement => {
  return (
    <AccordionItem border="none" marginBottom="40px">
      <AccordionButton
        backgroundColor="primary.green.600"
        borderRadius="20px"
        _hover={{ bg: "primary.green.600" }}
      >
        <Box flex="1" textAlign="left">
          <Text color="text.white.100" fontWeight="bold">
            {accordionTitle}
          </Text>
        </Box>
        <AccordionIcon color="white" />
      </AccordionButton>

      <AccordionPanel>
        {fixedQuestions.map((question, index) => (
          <QuestionCard
            question={question}
            viewOnly
            key={`${question.question}_${index + 1}`}
          />
        ))}
        {dynamicQuestions.map((question, index) => (
          <QuestionCard
            question={question}
            viewOnly={false}
            key={`${question.question}_${index + fixedQuestions.length + 1}`}
          />
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default QuestionsAccordionItem;
