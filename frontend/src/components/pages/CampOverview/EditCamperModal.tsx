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
} from "@chakra-ui/react";
import { Camper } from "../../../types/CamperTypes";

type EditCamperModalProps = {
  camper: Camper;
  editCamperModalIsOpen: boolean;
  editCamperOnClose: () => void;
};

const EditCamperModal = ({
  camper,
  editCamperModalIsOpen,
  editCamperOnClose,
}: EditCamperModalProps): JSX.Element => {
  return (
    <Modal isOpen={editCamperModalIsOpen} onClose={editCamperOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{camper.firstName}</ModalBody>

        <ModalFooter>
          <Button onClick={editCamperOnClose}>Close</Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCamperModal;
