import React from "react";

import { HStack, VStack } from "@chakra-ui/react";

import {
  EditCamperInfoFields,
  EditModalSetterFunctions,
} from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import EditCamperFormResponseSection from "./EditCamperFormResponseSection";
import InputFieldWithLabel from "../../../common/InputFieldWithLabel";
import TextAreaWithLabel from "../../../common/TextAreaWithLabel";

const EditCamperModalForm = ({
  formQuestions,
  formStateVariables,
  setStateFuncs,
}: {
  formQuestions: FormQuestion[];
  formStateVariables: EditCamperInfoFields;
  setStateFuncs: EditModalSetterFunctions;
}): JSX.Element => {
  return (
    <>
      <HStack>
        <InputFieldWithLabel
          labelText="First name"
          isRequired
          isInvalid={!formStateVariables.firstName}
          onInputChange={(event) => {
            setStateFuncs.setFirstName(event.target.value);
          }}
          value={formStateVariables.firstName}
        />
        <InputFieldWithLabel
          labelText="Last name"
          isRequired
          isInvalid={!formStateVariables.lastName}
          onInputChange={(event) => {
            setStateFuncs.setLastName(event.target.value);
          }}
          value={formStateVariables.lastName}
        />
        <InputFieldWithLabel
          labelText="Camper age"
          isRequired
          isInvalid={!formStateVariables.age}
          onInputChange={(event) => {
            setStateFuncs.setAge(parseInt(event.target.value, 10));
          }}
          value={formStateVariables.age}
        />
      </HStack>

      <VStack align="start" py="30px">
        <TextAreaWithLabel
          labelText="Allergies"
          isRequired
          onChange={(event) => {
            setStateFuncs.setAllergies(event.target.value);
          }}
          value={formStateVariables.allergies}
        />
        <TextAreaWithLabel
          labelText="Special needs"
          isRequired
          onChange={(event) => {
            setStateFuncs.setSpecialNeeds(event.target.value);
          }}
          value={formStateVariables.specialNeeds}
        />
      </VStack>

      {formStateVariables.formResponses && (
        <EditCamperFormResponseSection
          formQuestions={formQuestions}
          camperResponses={formStateVariables.formResponses}
          setFormResponses={setStateFuncs.setFormResponses}
        />
      )}
    </>
  );
};

export default EditCamperModalForm;
