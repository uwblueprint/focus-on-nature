import {
  Button,
  HStack,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import React from "react";
import { ModalBody } from "react-bootstrap";

type RegistrationErrorModalProps = {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const RegistrationErrorModal = ({
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
}: RegistrationErrorModalProps): React.ReactElement => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered preserveScrollBarGap>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <HStack direction="row" w="100%" justify="flex-end" spacing={3}>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onConfirm}>Go back to checkout</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegistrationErrorModal;
