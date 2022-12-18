import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { RegistrantExperienceCamper } from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import MultipleChoiceGroup from "./MultipleChoiceGroup";
import MultiselectGroup from "./MultiselectGroup";

type QuestionsCardProps = {
  camper: RegistrantExperienceCamper;
  formQuestions: FormQuestion[];
};

const QuestionsCard = ({
  camper,
  formQuestions,
}: QuestionsCardProps): React.ReactElement => {
  // camper.formQuestions --> map
  // formQuestions[question] = answer
  //

  const [formResponses, setFormResponses] = useState<Map<string, string>>(
    {} as Map<string, string>,
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
          {formQuestions.map((question, index) => (
            <WrapItem
              key={index}
              width={{ sm: "100%", md: "47%" }}
              px="40px"
              py="12px"
            >
              {question.type === "Text" && (
                <FormControl isRequired>
                  <FormLabel fontWeight="bold" fontSize="18px">
                    {question.question}
                  </FormLabel>
                  <Text
                    textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}
                    mb="3"
                  >
                    {question.description}
                  </Text>
                  <Textarea backgroundColor="background.white.100" />
                </FormControl>
              )}
              {question.type === "Multiselect" && (
                <MultiselectGroup question={question} />
              )}
              {question.type === "MultipleChoice" && (
                <MultipleChoiceGroup question={question} />
              )}
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </Box>
  );
};

export default QuestionsCard;
