import React, {useState} from "react";
import { Accordion, Box, Button, HStack, Text,} from "@chakra-ui/react";
import { FormQuestion } from "../../../../types/CampsTypes";
import CamperInfoAccordion from "./CamperInfoAccordion";

type RegistrationFormPageProps = {
  campQuestions : Array<FormQuestion>;
}

const RegistrationFormPage = ({
  campQuestions
}: RegistrationFormPageProps): JSX.Element => {

  const camperInfoQuestions = campQuestions.filter(question => question.category === "PersonalInfo");
  const campSpecificQuestions = campQuestions.filter(question => question.category === "CampSpecific");
  const emergencyContactQuestions = campQuestions.filter(question => question.category === "EmergencyContact");

  return (
    <>
      <HStack display="flex" justifyContent="space-between" alignItems="center" mb={10}>
        <Text textStyle="displayXLarge">
          Registration Information
        </Text>
        <Button>
          Add Question
        </Button>
      </HStack>
      <Accordion allowToggle>
          <CamperInfoAccordion 
            camperInfoQuestions={camperInfoQuestions}
          />
      </Accordion>
    </>
  );
};

export default RegistrationFormPage;
