import { VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { AdditionalInfoReducerDispatch } from "../../../../../../types/AdditionalInfoTypes";
import { RegistrantExperienceCamper } from "../../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../../types/CampsTypes";
import MultipleChoiceGroup from "../QuestionGroups/MultipleChoiceGroup";
import MultiselectGroup from "../QuestionGroups/MultiselectGroup";
import TextInputGroup from "../QuestionGroups/TextInputGroup";
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

  return (
    <QuestionsCardWrapper title={`${camper.firstName} ${camper.lastName}`}>
      <VStack py="24px">
        <Wrap width="100%" px="20px" justify="space-between">
          {campSpecificFormQuestions.map((question) => (
            <WrapItem
              key={`additional_info_question_${question}`}
              width={{ sm: "100%", md: mdWrapWidth }}
              px="20px"
              py="12px"
            >
              {question.type === "Text" && (
                <TextInputGroup
                  formResponses={camper.formResponses}
                  camperIndex={camperIndex}
                  question={question}
                  dispatchAdditionalInfoAction={dispatchAdditionalInfoAction}
                  nextClicked={nextClicked}
                />
              )}
              {question.type === "Multiselect" && (
                <MultiselectGroup
                  formResponses={camper.formResponses}
                  camperIndex={camperIndex}
                  question={question}
                  dispatchAdditionalInfoAction={dispatchAdditionalInfoAction}
                  nextClicked={nextClicked}
                />
              )}
              {question.type === "MultipleChoice" && (
                <MultipleChoiceGroup
                  formResponses={camper.formResponses}
                  camperIndex={camperIndex}
                  question={question}
                  dispatchAdditionalInfoAction={dispatchAdditionalInfoAction}
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
