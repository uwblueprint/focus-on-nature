import {
  Button,
  HStack,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ModalBody } from "react-bootstrap";
import { modalBodyStyles, modalHeadingStyles } from "./textStyles";

type RegistrationErrorModalProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const RegistrationErrorModal = ({
  title,
  message,
  onConfirm,
  isOpen,
  onClose,
}: RegistrationErrorModalProps): React.ReactElement => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle={modalHeadingStyles}>{title}</Text>
        </ModalHeader>
        <ModalBody>
          <Text textStyle={modalBodyStyles} px="8px">
            {message}
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack direction="row" w="100%" justify="flex-end" spacing={3}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onConfirm();
              }}
            >
              Go back to checkout
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegistrationErrorModal;
