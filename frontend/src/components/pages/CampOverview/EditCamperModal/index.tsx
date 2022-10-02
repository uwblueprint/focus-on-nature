import React, {useState } from "react";

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { Camper, EditModalFormVariables, EditModalSetterFunctions, EmergencyContact } from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import EditCamperModalForm from "./EditCamperModalForm";


type EditCamperModalProps = {
  camper: Camper;
  editCamperModalIsOpen: boolean;
  formQuestions: FormQuestion[]
  editCamperOnClose: () => void;
};


const EditCamperModal = ({
  camper,
  formQuestions,
  editCamperModalIsOpen,
  editCamperOnClose,
}: EditCamperModalProps): JSX.Element => {
  
  // State for the edit form fields
  const [firstName, setFirstName] = useState<string>(camper.firstName)
  const [lastName, setLastName] = useState<string>(camper.lastName)
  const [age, setAge] = useState<number>(camper.age)
  const [allergies, setAllergies] = useState<string | undefined>(camper.allergies)
  const [specialNeeds, setSpecialNeeds] = useState<string | undefined>(camper.specialNeeds)
  const [formResponses, setFormResponses] = useState< Map<string, string> | undefined>(camper.formResponses)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(camper.contacts)

  const setStateFuncs : EditModalSetterFunctions = {
    setFirstName, 
    setLastName, 
    setAge, 
    setAllergies, 
    setSpecialNeeds, 
    setFormResponses,
    setEmergencyContacts
  };

  const stateVariables : EditModalFormVariables = {
    firstName, lastName, age, allergies, specialNeeds, formResponses, contacts : emergencyContacts
  }

  const onSaveClicked = () => {
    console.log(firstName)
  };


  return (
    <Modal 
      isOpen={editCamperModalIsOpen} 
      onClose={editCamperOnClose}
      preserveScrollBarGap
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
          <EditCamperModalForm 
            formQuestions={formQuestions}
            formStateVariables={stateVariables}
            setStateFuncs={setStateFuncs}
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={editCamperOnClose} variant="editModalCancel">Cancel</Button>
          <Button variant="editModalSave" onSubmit={onSaveClicked}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCamperModal;
