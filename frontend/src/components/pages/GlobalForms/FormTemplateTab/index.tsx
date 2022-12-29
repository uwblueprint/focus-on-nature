import React from "react";

import { Accordion } from "@chakra-ui/react";
import {
  CreateFormQuestionRequest,
  FormQuestion,
} from "../../../../types/CampsTypes";
import {
  fixedCamperInfoQuestions,
  fixedEmergencyContactQuestions,
} from "../../../../constants/FixedQuestions";
import QuestionsAccordionItem from "../../../common/formQuestions/QuestionsAccordionItem";

type RegistrationFormTemplateTabProps = {
  templateQuestions: Array<FormQuestion>;
  onRemoveFormQuestion: (questionToRemove: FormQuestion) => void;
  onEditFormQuestion: (
    oldQuestion: FormQuestion,
    newQuestion: CreateFormQuestionRequest,
  ) => void;
};

const RegistrationFormTemplateTab = ({
  templateQuestions,
  onRemoveFormQuestion,
  onEditFormQuestion,
}: RegistrationFormTemplateTabProps): React.ReactElement => {
  return (
    <div>
      <Accordion allowToggle defaultIndex={0}>
        <QuestionsAccordionItem
          fixedQuestions={fixedCamperInfoQuestions}
          dynamicQuestions={templateQuestions.filter(
            (question) => question.category === "PersonalInfo",
          )}
          accordionTitle="Camper Information"
          onDeleteCustomQuestion={onRemoveFormQuestion}
          onEditCustomQuestion={onEditFormQuestion}
        />
        <QuestionsAccordionItem
          fixedQuestions={fixedEmergencyContactQuestions}
          dynamicQuestions={templateQuestions.filter(
            (question) => question.category === "EmergencyContact",
          )}
          accordionTitle="Emergency Contact"
          onDeleteCustomQuestion={onRemoveFormQuestion}
          onEditCustomQuestion={onEditFormQuestion}
        />
      </Accordion>
    </div>
  );
};

export default RegistrationFormTemplateTab;
