import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface GeneralDeleteShiftModalProps {
  title: string;
  bodyText: string;
  buttonLabel: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}
const GeneralDeleteShiftModal = ({
  title,
  bodyText,
  buttonLabel,
  isOpen,
  onClose,
  onDelete,
}: GeneralDeleteShiftModalProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent py="52px" px="48px">
        <ModalHeader>
          <Text>{title}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{bodyText}</ModalBody>
        <ModalFooter>
          <Button width="100%" colorScheme="red" onClick={onDelete}>
            {buttonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeneralDeleteShiftModal;
