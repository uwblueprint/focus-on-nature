import {
  Box,
  Button,
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { WaiverClause } from "../../../../types/AdminTypes";

type WaiverAddSectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddWaiverSectionClick: (newClause: WaiverClause) => void;
};

const WaiverAddSectionModal = ({
  isOpen,
  onClose,
  onAddWaiverSectionClick,
}: WaiverAddSectionModalProps): JSX.Element => {
  const [newClauseText, setNewClauseText] = React.useState("");
  const [clauseRequired, setClauseRequired] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setNewClauseText(inputValue);
  };

  const handleCheckboxChange = () => {
    setClauseRequired((prevState) => !prevState);
  };

  const submitModal = () => {
    const newClause: WaiverClause = {
      text: newClauseText,
      required: clauseRequired,
    };
    onAddWaiverSectionClick(newClause);
    setNewClauseText("");
    setClauseRequired(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered preserveScrollBarGap>
      <ModalOverlay />
      <ModalContent minWidth="30vw">
        <ModalHeader textStyle="heading">
          <Text>Add a new waiver section</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box justifyContent="space-evenly">
            <Text textStyle="bodyRegular">Waiver section</Text>
            <Textarea
              marginY="3"
              size="sm"
              colorScheme="green"
              minHeight="12vw"
              resize="none"
              value={newClauseText}
              onChange={handleInputChange}
            />
            <Checkbox
              colorScheme="green"
              isChecked={clauseRequired}
              onChange={handleCheckboxChange}
            >
              <Text textStyle="bodyRegular">Mark as a required section</Text>
            </Checkbox>
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button mr={3} onClick={onClose}>
              <Text>Cancel</Text>
            </Button>
            <Button
              bgColor="primary.green.100"
              color="background.white.100"
              onClick={() => submitModal()}
            >
              Add
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WaiverAddSectionModal;
