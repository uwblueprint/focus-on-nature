import { VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RegistrantExperienceCamper } from "../../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../../types/CampsTypes";
import MultipleChoiceGroup from "../QuestionGroups/MultipleChoiceGroup";
import MultiselectGroup from "../QuestionGroups/MultiselectGroup";
import TextInputGroup from "../QuestionGroups/TextInputGroup";
import QuestionsCardWrapper from "./QuestionsCardWrapper";

type CamperQuestionsCardProps = {
  camper: RegistrantExperienceCamper;
  formQuestions: FormQuestion[];
  updateCamperFormResponse: (
    index: number,
    formResponses: Map<string, string>,
  ) => void;
  index: number;
  submitClicked: boolean;
};

const CamperQuestionsCard = ({
  camper,
  formQuestions,
  updateCamperFormResponse,
  index,
  submitClicked,
}: CamperQuestionsCardProps): React.ReactElement => {
  const [formResponses, setFormResponses] = useState<Map<string, string>>(
    new Map<string, string>(),
  );

  // formResponses wasn't updated in time to get sent in so I shoved it in a useEffect
  useEffect(() => {
    updateCamperFormResponse(index, formResponses);
  }, [formResponses]);

  const updateFormResponse = (key: string, value: string) => {
    setFormResponses((prev) => {
      return { ...prev, [key]: value };
    });
  };

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
                  camperFormResponses={camper.formResponses}
                  question={question}
                  updateFormResponse={updateFormResponse}
                  submitClicked={submitClicked}
                />
              )}
              {question.type === "Multiselect" && (
                <MultiselectGroup
                  camperFormResponses={camper.formResponses}
                  question={question}
                  updateFormResponse={updateFormResponse}
                  submitClicked={submitClicked}
                />
              )}
              {question.type === "MultipleChoice" && (
                <MultipleChoiceGroup
                  camperFormResponses={camper.formResponses}
                  question={question}
                  updateFormResponse={updateFormResponse}
                  submitClicked={submitClicked}
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
