import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  HStack,
  Button,
  Text,
} from "@chakra-ui/react";
import { CreateFormQuestion } from "../../../../types/CampsTypes";

type DeleteCustomQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: ((questionToBeDeleted: CreateFormQuestion) => void) | undefined;
  question: CreateFormQuestion;
};

const DeleteCustomQuestionModal = ({
  isOpen,
  onClose,
  onDelete,
  question,
}: DeleteCustomQuestionModalProps): React.ReactElement => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      preserveScrollBarGap
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Question?</ModalHeader>
        <ModalBody>
          <Text textStyle="bodyRegular">{`Are you sure you want to delete "${question.question}"?`}</Text>
          <Text textStyle="bodyBold" pt={4}>
            Note: this action is irreversible.
          </Text>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="secondary.critical"
              onClick={() => {
                if (onDelete) onDelete(question);
              }}
            >
              Delete
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCustomQuestionModal;
