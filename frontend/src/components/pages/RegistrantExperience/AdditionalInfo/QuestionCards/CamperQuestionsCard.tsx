import { VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../types/CampsTypes";
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
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  submitClicked: boolean;
};

const CamperQuestionsCard = ({
  camper,
  formQuestions,
  updateCamperFormResponse,
  index,
  nextBtnRef,
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

    // this isn't updated in time
    console.log(`form response: ${JSON.stringify(formResponses)}`);

    // updateCamperFormResponse(index, formResponses);
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
                  submitClicked={submitClicked}
                />
              )}
              {question.type === "Multiselect" && (
                <MultiselectGroup
                  question={question}
                  updateFormResponse={updateFormResponse}
                  submitClicked={submitClicked}
                />
              )}
              {question.type === "MultipleChoice" && (
                <MultipleChoiceGroup
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
