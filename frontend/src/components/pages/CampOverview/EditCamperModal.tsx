import React from "react";

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  HStack,
  FormControl,
  FormLabel,
  VStack,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  CheckboxGroup,
  Divider,
  Checkbox,
  Heading,
} from "@chakra-ui/react";
import { Camper, EmergencyContact } from "../../../types/CamperTypes";
import { FormQuestion } from "../../../types/CampsTypes";


type EditCamperModalProps = {
  camper: Camper;
  editCamperModalIsOpen: boolean;
  formQuestions: FormQuestion[]
  editCamperOnClose: () => void;
};

const CamperFormResponseSection = ({
  formQuestions,
  camperResponses
} : {
  formQuestions: FormQuestion[];
  camperResponses: Map<string, string>;
}): JSX.Element => {

  const renderMCQ = (question: string, answer: string | undefined, options: string[], questionId: string) => {    
    return (
      <VStack key={questionId} align="start">
        <FormLabel><b>{question}</b></FormLabel>
        <RadioGroup defaultValue={answer}>
          <Stack direction="column">
            {options.map(option => (
              <Radio key={`${questionId}_${option}`} value={option}>{option}</Radio>
            ))}
          </Stack>
        </RadioGroup>
        <br/>
      </VStack>
    )
  }

  const renderText = (question : string, answer: string, questionId: string) => {
    return (
      <VStack align="start" key={questionId} minW="100%">
        <FormLabel><b>{question}</b></FormLabel>
        <Textarea 
          resize="none"
          minH="120px"
          textAlign="start"
          defaultValue={answer}
        />
        <br/>
      </VStack>
    )
  }

  const renderMultiSelect = (question : string, answer: string | undefined, options : string[], questionId: string) => {
    
    const answeredOptions = answer?.split(",")

    return (
      <VStack key={questionId} align="start">
        <FormLabel><b>{question}</b></FormLabel>
        <CheckboxGroup defaultValue={answeredOptions}>
          <Stack direction="column">
            {options.map(option => (
              <Checkbox key={`${questionId}_${option}`} value={option}>{option}</Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
        <br/>
      </VStack>
    )
  }
  
  return (
    <VStack align="start">
      {
        formQuestions.map(formQuestion => {
          const {question, type} = formQuestion
          const camperAnswerIndex = Object.keys(camperResponses).indexOf(question)
          const camperAnswer = camperAnswerIndex !== -1 ? Object.values(camperResponses)[camperAnswerIndex] : ""
  
          switch (type){
            case "MultipleChoice":
              return formQuestion.options ? renderMCQ(
                question, 
                camperAnswer, 
                formQuestion.options,
                formQuestion.id
                ) : null
            case "Multiselect":
              return formQuestion.options ? renderMultiSelect(
                question, 
                camperAnswer, 
                formQuestion.options,
                formQuestion.id
                ) : null
            case "Text":
              return renderText(
                question,
                camperAnswer,
                formQuestion.id
              )
            default:
              return null
          }
        })
      }   
    </VStack>
  )
}

const CamperEmergencyContactSection = ({
  contacts,
  camperName
}: {
  contacts : EmergencyContact[];
  camperName : string;
}) => {
  
  return contacts.length > 0 ? (
    <VStack align="start" minW="100%">
      {
        contacts.map((contact, index) => {
          return (
            <VStack align="start" key={`${camperName}_contact_${index}`} minW="100%">
              <Heading marginBottom="5px" as="h3" size='md'>{index === 0 ? "Primary contact" : "Secondary contact"}</Heading>
              <HStack align="start" minW="100%">
                <VStack align="start" flexGrow="1">
                  <FormLabel><b>First name</b></FormLabel>
                  <Input defaultValue={contact.firstName}/>
                </VStack>
                <VStack align="start" flexGrow="1">
                  <FormLabel><b>Last name</b></FormLabel>
                  <Input defaultValue={contact.lastName}/>
                </VStack>
              </HStack>
              <HStack align="start" minW="100%">
                <VStack align="start" flexGrow="1">
                  <FormLabel><b>Email</b></FormLabel>
                  <Input defaultValue={contact.email}/>
                </VStack>
                <VStack align="start" flexGrow="1">
                  <FormLabel><b>Relationship to camper</b></FormLabel>
                  <Input defaultValue={contact.relationshipToCamper}/>
                </VStack>
              </HStack>
              <br/>
            </VStack>
          )
        })
      }
    </VStack>

  ) : null
}


const EditCamperModalForm = ({
  camper,
  formQuestions,
}: {
  camper : Camper;
  formQuestions: FormQuestion[];
}) : JSX.Element => {

  return (
    <FormControl>
      <HStack>
        <VStack align="start" flexGrow="1">
          <FormLabel><b>First name</b></FormLabel>
          <Input defaultValue={camper.firstName}/>
        </VStack>
        <VStack align="start" flexGrow="1">
          <FormLabel><b>Last name</b></FormLabel>
          <Input defaultValue={camper.lastName}/>
        </VStack>
        <VStack align="start" flexGrow="1">
          <FormLabel><b>Camper age</b></FormLabel>
          <Input defaultValue={camper.age}/>
        </VStack>
      </HStack>
      <br/>
      <VStack align="start">
        <FormLabel><b>Allergies</b></FormLabel>
        <Textarea 
          defaultValue={camper.allergies}
          minH="120px"
          textAlign="start"
          resize="none"
        />
        <FormLabel><b>Special Needs</b></FormLabel>
        <Textarea 
          defaultValue={camper.specialNeeds ? camper.specialNeeds : ""}
          resize="none"
          minH="120px"
          textAlign="start"
        />
      </VStack>
      <br/>
      {camper.formResponses ? <CamperFormResponseSection 
        formQuestions={formQuestions}
        camperResponses={camper.formResponses}
      /> : null}
      <Divider/>
      <br/>
      <CamperEmergencyContactSection contacts={camper.contacts} camperName={camper.firstName}/>

    </FormControl>
  );
}


const EditCamperModal = ({
  camper,
  formQuestions,
  editCamperModalIsOpen,
  editCamperOnClose,
}: EditCamperModalProps): JSX.Element => {
  
  return (
    <Modal 
      isOpen={editCamperModalIsOpen} 
      onClose={editCamperOnClose}
    >
      <ModalOverlay />
      <ModalContent
        w="1000px"
        minW="1000px"
        maxW="1000px"
        minH="750px"
        maxH="750px"
      >
        <ModalHeader>Edit {camper.firstName} {camper.lastName}&apos;s Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="scroll">
          <EditCamperModalForm camper={camper} formQuestions={formQuestions}/>
        </ModalBody>

        <ModalFooter>
          <Button onClick={editCamperOnClose} variant="editModalCancel">Cancel</Button>
          <Button variant="editModalSave">Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCamperModal;
