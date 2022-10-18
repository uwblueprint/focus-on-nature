import React from "react";

import {
  HStack,
  VStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Text,
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
              <Text fontSize="md" as="b">
                First name
              </Text>
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
              <Text fontSize="md" as="b">
                Last name
              </Text>
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
              <Text fontSize="md" as="b">
                Camper age
              </Text>
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

      <VStack align="start" py="30px">
        <FormControl isRequired>
          <FormLabel>
            <Text fontSize="md" as="b">
              Allergies
            </Text>
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
        <FormControl isRequired>
          <FormLabel>
            <Text fontSize="md" as="b">
              Special Needs
            </Text>
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
