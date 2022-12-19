import { Box, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import MultipleChoiceGroup from "./MultipleChoiceGroup";
import MultiselectGroup from "./MultiselectGroup";
import TextInputGroup from "./TextInputGroup";

type QuestionsCardProps = {
  camper: RegistrantExperienceCamper;
  formQuestions: FormQuestion[];
  updateCampers: (index: number, formResponses: Map<string, string>) => void;
  index: number;
};

const QuestionsCard = ({
  camper,
  formQuestions,
  updateCampers,
  index,
}: QuestionsCardProps): React.ReactElement => {
  const [formResponses, setFormResponses] = useState<Map<string, string>>(
    {} as Map<string, string>,
  );

  const updateFormResponse = (key: string, value: string) => {
    setFormResponses((prev) => {
      return { ...prev, [key]: value };
    });
    updateCampers(index, formResponses);
  };

  console.log(
    `form responses for camper ${camper.firstName}: ${JSON.stringify(
      formResponses,
    )}`,
  );

  return (
    <Box
      width="100%"
      backgroundColor="background.grey.200"
      marginY={10}
      boxShadow="lg"
      rounded="xl"
      borderWidth={1}
      paddingBottom={5}
    >
      <Box
        backgroundColor="background.white.100"
        borderTopRadius={10}
        px="40px"
        py="12px"
        borderBottomWidth={1}
      >
        <Text textStyle="displaySmallSemiBold">{`${camper.firstName} ${camper.lastName}`}</Text>
      </Box>
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
    </Box>
  );
};

export default QuestionsCard;
