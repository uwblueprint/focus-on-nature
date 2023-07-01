import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import {
  AdditionalInfoActions,
  AdditionalInfoReducerDispatch,
} from "../../../../../../types/AdditionalInfoTypes";
import { RegistrantExperienceCamper } from "../../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../../types/CampsTypes";
import MultipleChoiceGroup from "../../QuestionGroups/MultipleChoiceGroup";
import MultiselectGroup from "../../QuestionGroups/MultiselectGroup";
import TextInputGroup from "../../QuestionGroups/TextInputGroup";
import EditCardFooter from "./EditCardFooter";
import EditCardHeader from "./EditCardHeader";
import { checkAdditionalQuestionsAnsweredSingleCamper } from "../../AdditionalInfo/additionalInfoReducer";

type EditAdditionalQuestionsCardProps = {
  camper: RegistrantExperienceCamper;
  camperIndex: number;
  campSpecificFormQuestions: FormQuestion[];
  dispatchAdditionalInfoAction: (action: AdditionalInfoReducerDispatch) => void;
  isEditing: number;
  setIsEditing: React.Dispatch<React.SetStateAction<number>>;
};

const EditAdditionalQuestionsCard = ({
  camper,
  camperIndex,
  campSpecificFormQuestions,
  dispatchAdditionalInfoAction,
  isEditing,
  setIsEditing,
}: EditAdditionalQuestionsCardProps): React.ReactElement => {
  const mdWrapWidth = campSpecificFormQuestions.length > 1 ? "47%" : "100%";

  const [editingIndividual, setEditingIndividual] = useState(false);

  const setEditing = (state: boolean) => {
    setEditingIndividual(state); // Local editing state.
    setIsEditing(state ? isEditing + 1 : isEditing - 1); // Global editing state.
  };

  const [updateMemo, setUpdateMemo] = useState(0);
  const initialCamperFormResponses = useMemo(
    () =>
      camper.formResponses ? Object.fromEntries(camper.formResponses) : {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateMemo],
  );

  const EditCamperQuestionsOnDelete = () => {
    campSpecificFormQuestions.forEach((question) => {
      dispatchAdditionalInfoAction({
        type: AdditionalInfoActions.UPDATE_RESPONSE,
        camperIndex,
        question: question.question,
        data: initialCamperFormResponses[question.question] || "",
      });
    });
    setEditing(false);
  };

  const [save, setSave] = useState(false);

  const updateFormErrorMsgs = () => {
    const requiredQuestions = campSpecificFormQuestions
      .filter((question) => question.required)
      .map((question) => question.question);

    const valid = checkAdditionalQuestionsAnsweredSingleCamper(
      camper,
      requiredQuestions,
    );

    if (valid) {
      setSave(true);
      setEditing(false);
      setUpdateMemo(updateMemo + 1);
    }
  };

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
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%" mt={2} mb={2}>
      <EditCardHeader
        title={`${camper.firstName} ${camper.lastName}`}
        onClick={() => setEditing(true)}
        editing={editingIndividual}
      />

      <Box
        zIndex={0}
        backgroundColor="#FFFFFFAA"
        borderRadius="0px 0px 10px 10px"
        _hover={{ cursor: editingIndividual ? "auto" : "not-allowed" }}
      >
        <Box
          zIndex={editingIndividual ? 1 : -1}
          position="relative"
          bg="background.grey.500"
          borderRadius="0px 0px 16px 16px"
        >
          <Box px={{ sm: "5", lg: "20" }}>
            <Wrap width="100%" pt={7} justify="space-between">
              {campSpecificFormQuestions.map((question) => (
                <WrapItem
                  key={`additional_info_question_${question.id}`}
                  width={{ sm: "100%", md: mdWrapWidth }}
                  py="12px"
                >
                  {question.type === "Text" && (
                    <TextInputGroup
                      formResponses={camper.formResponses}
                      question={question}
                      handleTextChange={handleTextChange}
                      nextClicked={save}
                      editing={editingIndividual}
                    />
                  )}
                  {question.type === "Multiselect" && (
                    <MultiselectGroup
                      formResponses={camper.formResponses}
                      question={question}
                      handleSelectionChange={handleSelectionChange}
                      nextClicked={save}
                      editing={editingIndividual}
                    />
                  )}
                  {question.type === "MultipleChoice" && (
                    <MultipleChoiceGroup
                      formResponses={camper.formResponses}
                      question={question}
                      handleMultipleChoiceChange={handleMultipleChoiceChange}
                      nextClicked={save}
                      editing={editingIndividual}
                    />
                  )}
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <EditCardFooter
            onDelete={EditCamperQuestionsOnDelete}
            updateFormErrorMsgs={updateFormErrorMsgs}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EditAdditionalQuestionsCard;
