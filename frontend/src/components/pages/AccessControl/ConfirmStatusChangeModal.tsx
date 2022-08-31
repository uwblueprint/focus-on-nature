import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface ConfirmStatusChangeModalProps {
  title: string;
  bodyText: string;
  buttonLabel: string;
  buttonColor: string;
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: () => void;
}

const ConfirmStatusChangeModal = ({
  title,
  bodyText,
  buttonLabel,
  buttonColor,
  isOpen,
  onClose,
  onChangeStatus,
}: ConfirmStatusChangeModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent py="22px" px="16px">
        <ModalHeader>
          <Text textStyle="heading">{title}</Text>
        </ModalHeader>
        <ModalBody textStyle="mobileBody" color="hubbard.100">
          {bodyText}
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button onClick={onClose} padding="20px">
              Cancel
            </Button>
            <Button
              colorScheme={buttonColor}
              onClick={onChangeStatus}
              padding="20px"
            >
              {buttonLabel}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmStatusChangeModal;
