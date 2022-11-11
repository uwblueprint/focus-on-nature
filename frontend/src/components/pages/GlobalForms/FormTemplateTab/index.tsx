import React from "react";

import { Accordion } from "@chakra-ui/react";
import { FormQuestion } from "../../../../types/CampsTypes";
import {
  fixedCamperInfoQuestions,
  fixedEmergencyContactQuestions,
} from "../../../../constants/FixedQuestions";
import QuestionsAccordionItem from "../../../common/formQuestions/QuestionsAccordionItem";

type RegistrationFormTemplateTabProps = {
  templateQuestions: Array<FormQuestion>;
};

const RegistrationFormTemplateTab = ({
  templateQuestions,
}: RegistrationFormTemplateTabProps): React.ReactElement => {
  return (
    <div>
      <Accordion allowToggle>
        <QuestionsAccordionItem
          fixedQuestions={fixedCamperInfoQuestions}
          dynamicQuestions={templateQuestions.filter(
            (question) => question.category === "PersonalInfo",
          )}
          accordionTitle="Camper Information"
        />
        <QuestionsAccordionItem
          fixedQuestions={fixedEmergencyContactQuestions}
          dynamicQuestions={templateQuestions.filter(
            (question) => question.category === "EmergencyContact",
          )}
          accordionTitle="Emergency Contact"
        />
      </Accordion>
    </div>
  );
};

export default RegistrationFormTemplateTab;
