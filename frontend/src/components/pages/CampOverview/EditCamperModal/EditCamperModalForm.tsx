import React from "react";

import {
  HStack,
  VStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import {
  EditCamperInfoFields,
  EditModalSetterFunctions,
} from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import EditCamperFormResponseSection from "./EditCamperFormResponseSection";

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
        <VStack align="start" flexGrow="1">
          <FormControl isRequired isInvalid={!formStateVariables.firstName}>
            <FormLabel>
              <b>First name</b>
            </FormLabel>
            <Input
              onChange={(event) => {
                setStateFuncs.setFirstName(event.target.value);
              }}
              value={formStateVariables.firstName}
            />
          </FormControl>
        </VStack>
        <VStack align="start" flexGrow="1">
          <FormControl isRequired isInvalid={!formStateVariables.lastName}>
            <FormLabel>
              <b>Last name</b>
            </FormLabel>
            <Input
              onChange={(event) => {
                setStateFuncs.setLastName(event.target.value);
              }}
              value={formStateVariables.lastName}
            />
          </FormControl>
        </VStack>
        <VStack align="start" flexGrow="1">
          <FormControl isRequired isInvalid={!formStateVariables.age}>
            <FormLabel>
              <b>Camper age</b>
            </FormLabel>
            <Input
              onChange={(event) => {
                setStateFuncs.setAge(parseInt(event.target.value, 10));
              }}
              value={formStateVariables.age}
            />
          </FormControl>
        </VStack>
      </HStack>
      <br />
      <VStack align="start">
        <FormControl>
          <FormLabel>
            <b>Allergies</b>
          </FormLabel>
          <Textarea
            minH="120px"
            textAlign="start"
            resize="none"
            onChange={(event) => {
              setStateFuncs.setAllergies(event.target.value);
            }}
            value={formStateVariables.allergies}
          />
        </FormControl>
        <FormControl>
          <FormLabel>
            <b>Special Needs</b>
          </FormLabel>
          <Textarea
            resize="none"
            minH="120px"
            textAlign="start"
            onChange={(event) => {
              setStateFuncs.setSpecialNeeds(event.target.value);
            }}
            value={formStateVariables.specialNeeds}
          />
        </FormControl>
      </VStack>
      <br />
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
