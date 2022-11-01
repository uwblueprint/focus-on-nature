import React from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";

interface DeleteWaiverModalProps {
  deleteModalIsOpen: boolean;
  clauseIdx: number;
  onDeleteWaiverSection: (clauseIdx: number) => void;
  onDeleteModalClose: () => void;
}
const WaiverSectionCard = ({
  deleteModalIsOpen,
  clauseIdx,
  onDeleteModalClose,
  onDeleteWaiverSection,
}: DeleteWaiverModalProps): JSX.Element => {
  function onDeleteConfirm() {
    onDeleteWaiverSection(clauseIdx);
    onDeleteModalClose();
  }

  return (
    <Modal
      isOpen={deleteModalIsOpen}
      onClose={onDeleteModalClose}
      isCentered
      preserveScrollBarGap
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Text mt="16px" textStyle="heading">
            Delete waiver section?
          </Text>

          <Text mb="28px" mt="12px" textStyle="bodyRegular">
            Are you sure you want to delete this waiver section?
          </Text>

          <Text textStyle="bodyBold">Note: this action is irreversible.</Text>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onDeleteModalClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDeleteConfirm}>
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WaiverSectionCard;
