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

interface DeleteCampConfirmationModelProps {
  title: string;
  bodyText: string;
  bodyText2?: string;
  buttonLabel: string;
  buttonColor: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmation: () => void;
}

const DeleteCampConfirmationModel = ({
  title,
  bodyText,
  bodyText2,
  buttonLabel,
  buttonColor,
  isOpen,
  onClose,
  onConfirmation,
}: DeleteCampConfirmationModelProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered preserveScrollBarGap>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="heading">{title}</Text>
        </ModalHeader>
        <ModalBody textStyle="bodyRegular" color="text.default.100">
          {bodyText}
        </ModalBody>
        {bodyText2 ? (
          <ModalBody textStyle="bodyBold" color="text.default.100">
            {bodyText2}
          </ModalBody>
        ) : null}
        <ModalFooter>
          <HStack>
            <Button onClick={onClose} padding="20px">
              Cancel
            </Button>
            <Button
              colorScheme={buttonColor}
              onClick={onConfirmation}
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

export default DeleteCampConfirmationModel;
