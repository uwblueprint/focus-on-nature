import { VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import {
  AdditionalInfoActions,
  AdditionalInfoReducerDispatch,
} from "../../../../../../types/AdditionalInfoTypes";
import { RegistrantExperienceCamper } from "../../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../../types/CampsTypes";
import MultipleChoiceGroup from "../../QuestionGroups/MultipleChoiceGroup";
import MultiselectGroup from "../../QuestionGroups/MultiselectGroup";
import TextInputGroup from "../../QuestionGroups/TextInputGroup";
import QuestionsCardWrapper from "./QuestionsCardWrapper";

type CamperQuestionsCardProps = {
  camper: RegistrantExperienceCamper;
  camperIndex: number;
  campSpecificFormQuestions: FormQuestion[];
  dispatchAdditionalInfoAction: (action: AdditionalInfoReducerDispatch) => void;
  nextClicked: boolean;
};

const CamperQuestionsCard = ({
  camper,
  camperIndex,
  campSpecificFormQuestions,
  dispatchAdditionalInfoAction,
  nextClicked,
}: CamperQuestionsCardProps): React.ReactElement => {
  const mdWrapWidth = campSpecificFormQuestions.length > 1 ? "47%" : "100%";

  const handleMultipleChoiceChange = (
    choice: string,
    question: FormQuestion,
  ) => {
    dispatchAdditionalInfoAction({
      type: AdditionalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: choice,
    });
  };

  const handleSelectionChange = (
    selectionsResponse: string,
    question: FormQuestion,
  ) => {
    dispatchAdditionalInfoAction({
      type: AdditionalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: selectionsResponse,
    });
  };

  const handleTextChange = (response: string, question: FormQuestion) => {
    dispatchAdditionalInfoAction({
      type: AdditionalInfoActions.UPDATE_RESPONSE,
      camperIndex,
      question: question.question,
      data: response,
    });
  };

  return (
    <QuestionsCardWrapper title={`${camper.firstName} ${camper.lastName}`}>
      <VStack py="24px">
        <Wrap width="100%" px="20px" justify="space-between">
          {campSpecificFormQuestions.map((question) => (
            <WrapItem
              key={`additional_info_question_${question.id}`}
              width={{ sm: "100%", md: mdWrapWidth }}
              px="20px"
              py="12px"
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
      </VStack>
    </QuestionsCardWrapper>
  );
};

export default CamperQuestionsCard;
