import React from "react";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";

import { CreateFormQuestion, FormQuestion } from "../../../types/CampsTypes";
import QuestionCard from "./QuestionCard";
import RegistrationQuestionCard from "../../pages/CampCreation/RegistrationForm/RegistrationQuestionCard";
import NoRegistrationQuestionsCard from "../../pages/CampCreation/RegistrationForm/NoRegistrationQuestionsCard";

type QuestionsAccordionItemProps = {
  fixedQuestions: Array<FormQuestion>; // A question for presentational purposes only, Admin can not edit or delete this
  dynamicQuestions: Array<FormQuestion>; // Questions added by the admin during the respective workflow which can be editted + deleted
  accordionTitle: string;
  onDeleteCustomQuestion?: (questionToBeDeleted: CreateFormQuestion) => void;
  onEditCustomQuestion?: (
    oldQuestion: CreateFormQuestion,
    newQuestion: CreateFormQuestion,
  ) => void;
  isTemplatePage?: boolean;
};

const QuestionsAccordionItem = ({
  fixedQuestions,
  dynamicQuestions,
  accordionTitle,
  onDeleteCustomQuestion,
  onEditCustomQuestion,
  isTemplatePage = true,
}: QuestionsAccordionItemProps): React.ReactElement => {
  const fixedQuestionsCount = fixedQuestions.length;
  const dynamicQuestionsCount = dynamicQuestions.length;

  return (
    <AccordionItem border="none" marginBottom="40px">
      <AccordionButton
        borderRadius="20px"
        bg="primary.green.600"
        _hover={{ bg: "primary.green.600" }}
      >
        <Box flex="1" textAlign="left">
          <Text color="text.white.100" textStyle="displayLarge" p={2}>
            {accordionTitle}
          </Text>
        </Box>
        <AccordionIcon color="white" />
      </AccordionButton>

      {isTemplatePage ? (
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
      ) : (
        <AccordionPanel>
          {fixedQuestionsCount + dynamicQuestionsCount === 0 && (
            <NoRegistrationQuestionsCard />
          )}
          {fixedQuestions.map((question, index) => (
            <RegistrationQuestionCard
              question={question}
              questionNumber={index + 1}
              viewOnly
              key={`${question.question}_${index + 1}`}
            />
          ))}
          {dynamicQuestions.map((question, index) => (
            <RegistrationQuestionCard
              question={question}
              questionNumber={index + fixedQuestionsCount + 1}
              onDeleteCustomQuestion={onDeleteCustomQuestion}
              onEditCustomQuestion={onEditCustomQuestion}
              viewOnly={false}
              key={`${question.question}_${index + 1}`}
            />
          ))}
        </AccordionPanel>
      )}
    </AccordionItem>
  );
};

export default QuestionsAccordionItem;
