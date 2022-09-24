import {
  Box,
  Button,
  HStack,
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

interface GeneralDeleteCamperModalProps {
  title: string;
  bodyText: string;
  bodyNote?: string;
  buttonLabel: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}
const GeneralDeleteCamperModal = ({
  title,
  bodyText,
  bodyNote,
  buttonLabel,
  isOpen,
  onClose,
  onDelete,
}: GeneralDeleteCamperModalProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p="20px" minWidth="30vw">
        <ModalHeader textStyle="heading">
          <Text>{title}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box paddingBottom="3">
            <Text textStyle="bodyRegular">{bodyText}</Text>
          </Box>
          {bodyNote && <Text textStyle="bodyBold">{bodyNote}</Text>}
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button mr={3} onClick={onClose}>
              <Text>Cancel</Text>
            </Button>
            <Button colorScheme="red" onClick={onDelete}>
              {buttonLabel}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeneralDeleteCamperModal;
