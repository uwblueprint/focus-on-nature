import React, { useState } from "react";

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  Camper,
  EditCamperInfoFields,
  EditModalSetterFunctions,
} from "../../../../types/CamperTypes";
import { FormQuestion } from "../../../../types/CampsTypes";
import CamperApiClient from "../../../../APIClients/CamperAPIClient";
import EditCamperModalForm from "./EditCamperModalForm";

type EditCamperModalProps = {
  camper: Camper;
  editCamperModalIsOpen: boolean;
  formQuestions: FormQuestion[];
  editCamperOnClose: () => void;
};

const EditCamperModal = ({
  camper,
  formQuestions,
  editCamperModalIsOpen,
  editCamperOnClose,
}: EditCamperModalProps): JSX.Element => {
  const toast = useToast();

  // State for the edit form fields
  const [firstName, setFirstName] = useState<string>(camper.firstName);
  const [lastName, setLastName] = useState<string>(camper.lastName);
  const [age, setAge] = useState<number>(camper.age);
  const [allergies, setAllergies] = useState<string | undefined>(
    camper.allergies,
  );
  const [specialNeeds, setSpecialNeeds] = useState<string | undefined>(
    camper.specialNeeds,
  );
  const [formResponses, setFormResponses] = useState<
    Map<string, string> | undefined
  >(camper.formResponses);

  const setStateFuncs: EditModalSetterFunctions = {
    setFirstName,
    setLastName,
    setAge,
    setAllergies,
    setSpecialNeeds,
    setFormResponses,
  };

  const stateVariables: EditCamperInfoFields = {
    hasPaid: camper.hasPaid,
    firstName,
    lastName,
    age,
    allergies,
    specialNeeds,
    formResponses,
  };

  const onSaveClicked = async () => {
    const editCamperFields: EditCamperInfoFields = {
      firstName,
      lastName,
      age,
      allergies,
      specialNeeds,
      formResponses,
      hasPaid: camper.hasPaid,
    };
    const isEditCamperSuccess = await CamperApiClient.updateCampersById(
      [camper.id],
      editCamperFields,
    );

    if (isEditCamperSuccess) {
      toast({
        description: `${camper.firstName} ${camper.lastName}'s information has been updated`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      toast({
        description: `An error occurred with updating ${camper.firstName} ${camper.lastName}'s information. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
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
        <ModalHeader>
          Edit {camper.firstName} {camper.lastName}&apos;s Information
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="scroll">
          <EditCamperModalForm
            formQuestions={formQuestions}
            formStateVariables={stateVariables}
            setStateFuncs={setStateFuncs}
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={editCamperOnClose} variant="editModalCancel">
            Cancel
          </Button>
          <Button
            variant="editModalSave"
            onClick={() => {
              onSaveClicked();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCamperModal;
