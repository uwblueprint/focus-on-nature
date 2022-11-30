import React from "react";

import { Accordion } from "@chakra-ui/react";
import { CreateFormQuestion, FormQuestion } from "../../../../types/CampsTypes";
import {
  fixedCamperInfoQuestions,
  fixedEmergencyContactQuestions,
} from "../../../../constants/FixedQuestions";
import QuestionsAccordionItem from "../../../common/formQuestions/QuestionsAccordionItem";

type RegistrationFormTemplateTabProps = {
  templateQuestions: Array<FormQuestion>;
  onDeleteCustomQuestion: (questionToBeDeleted: FormQuestion) => void;
  onEditCustomQuestion: (
    oldQuestion: FormQuestion,
    newQuestion: CreateFormQuestion,
  ) => void;
};

const RegistrationFormTemplateTab = ({
  templateQuestions,
  onDeleteCustomQuestion,
  onEditCustomQuestion,
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
          onDeleteCustomQuestion={onDeleteCustomQuestion}
          onEditCustomQuestion={onEditCustomQuestion}
        />
        <QuestionsAccordionItem
          fixedQuestions={fixedEmergencyContactQuestions}
          dynamicQuestions={templateQuestions.filter(
            (question) => question.category === "EmergencyContact",
          )}
          accordionTitle="Emergency Contact"
          onDeleteCustomQuestion={onDeleteCustomQuestion}
          onEditCustomQuestion={onEditCustomQuestion}
        />
      </Accordion>
    </div>
  );
};

export default RegistrationFormTemplateTab;
