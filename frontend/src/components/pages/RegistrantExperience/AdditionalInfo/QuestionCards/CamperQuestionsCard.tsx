import { VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../types/CampsTypes";
import MultipleChoiceGroup from "../QuestionGroups/MultipleChoiceGroup";
import MultiselectGroup from "../QuestionGroups/MultiselectGroup";
import QuestionsCardWrapper from "./QuestionsCardWrapper";
import TextInputGroup from "../QuestionGroups/TextInputGroup";

type CamperQuestionsCardProps = {
  camper: RegistrantExperienceCamper;
  formQuestions: FormQuestion[];
  updateCamperFormResponse: (
    index: number,
    formResponses: Map<string, string>,
  ) => void;
  index: number;
};

const CamperQuestionsCard = ({
  camper,
  formQuestions,
  updateCamperFormResponse,
  index,
}: CamperQuestionsCardProps): React.ReactElement => {
  const [formResponses, setFormResponses] = useState<Map<string, string>>(
    new Map<string, string>(),
  );

  const updateFormResponse = (key: string, value: string) => {
    setFormResponses((prev) => {
      return { ...prev, [key]: value };
    });
    updateCamperFormResponse(index, formResponses);
  };

  console.log(
    `form responses for camper ${camper.firstName}: ${JSON.stringify(
      formResponses,
    )}`,
  );

  return (
    <QuestionsCardWrapper title={`${camper.firstName} ${camper.lastName}`}>
      <VStack width="100%" py="24px">
        <Wrap>
          {formQuestions.map((question, i) => (
            <WrapItem
              key={i}
              width={{ sm: "100%", md: "47%" }}
              px="40px"
              py="12px"
            >
              {question.type === "Text" && (
                <TextInputGroup
                  question={question}
                  updateFormResponse={updateFormResponse}
                />
              )}
              {question.type === "Multiselect" && (
                <MultiselectGroup
                  question={question}
                  updateFormResponse={updateFormResponse}
                />
              )}
              {question.type === "MultipleChoice" && (
                <MultipleChoiceGroup
                  question={question}
                  updateFormResponse={updateFormResponse}
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
