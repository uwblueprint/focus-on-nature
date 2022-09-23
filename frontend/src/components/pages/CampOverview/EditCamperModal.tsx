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

type EditCamperModalProps = {
  camperId: string;
  editCamperModalIsOpen: boolean;
  editCamperOnClose: () => void;
};

const EditCamperModal = ({
  camperId,
  editCamperModalIsOpen,
  editCamperOnClose,
}: EditCamperModalProps): JSX.Element => {
  return (
    <Modal isOpen={editCamperModalIsOpen} onClose={editCamperOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{camperId}</ModalBody>

        <ModalFooter>
          <Button onClick={editCamperOnClose}>Close</Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCamperModal;
