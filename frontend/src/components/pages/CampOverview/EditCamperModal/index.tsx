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
  editCamperModalOnClose: () => void;
  handleRefetch: () => void;
};

const EditCamperModal = ({
  camper,
  formQuestions,
  editCamperModalIsOpen,
  editCamperModalOnClose,
  handleRefetch,
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

  const resetState = () => {
    setFirstName(camper.firstName);
    setLastName(camper.lastName);
    setAge(camper.age);
    setAllergies(camper.allergies);
    setSpecialNeeds(camper.specialNeeds);
    setFormResponses(camper.formResponses);
  };

  const closeModal = () => {
    resetState();
    editCamperModalOnClose();
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
    if (isEditCamperSuccess instanceof Error) {
      closeModal();
      toast({
        description: `An error occurred with updating ${camper.firstName} ${camper.lastName}'s information. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    } else {
      // TODO: introduce global state so we don't have to refetch
      closeModal();
      toast({
        description: `${camper.firstName} ${camper.lastName}'s information has been updated`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
      handleRefetch();
    }
  };

  return (
    <Modal
      isOpen={editCamperModalIsOpen}
      onClose={editCamperModalOnClose}
      preserveScrollBarGap
      isCentered
    >
      <ModalOverlay />
      <ModalContent minW="1000px" maxW="1000px" minH="750px" maxH="750px">
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
          <Button
            onClick={editCamperModalOnClose}
            background="background.grey.100"
            padding="12px, 25px, 12px, 25px"
            borderRadius="6px"
            width="109px"
            height="48px"
            marginRight="12px"
          >
            Cancel
          </Button>
          <Button
            background="primary.green.100"
            padding="12px, 25px, 12px, 25px"
            borderRadius="6px"
            width="91px"
            height="48px"
            color="text.white.100"
            onClick={onSaveClicked}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCamperModal;
