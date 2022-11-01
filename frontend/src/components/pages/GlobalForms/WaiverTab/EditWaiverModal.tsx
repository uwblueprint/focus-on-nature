import React from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";

interface EditWaiverModalProps {
  editModalIsOpen: boolean;
  clauseIdx: number;
  clauseData: WaiverClause;
  onEditWaiverSection: (clause: WaiverClause, clauseIdx: number) => void;
  onEditModalClose: () => void;
}
const WaiverSectionCard = ({
  editModalIsOpen,
  clauseIdx,
  clauseData,
  onEditWaiverSection,
  onEditModalClose,
}: EditWaiverModalProps): JSX.Element => {
  const [clauseText, setClauseText] = React.useState(clauseData.text);
  const [isRequired, setIsRequired] = React.useState(clauseData.required);

  function onEditConfirm() {
    const newClause = { text: clauseText, required: isRequired };
    onEditWaiverSection(newClause, clauseIdx);
    onEditModalClose();
  }

  return (
    <Modal
      isOpen={editModalIsOpen}
      onClose={onEditModalClose}
      isCentered
      preserveScrollBarGap
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="heading">Edit waiver section</Text>
        </ModalHeader>
        <ModalBody>
          <Text textStyle="bodyRegular">Edit waiver</Text>
          <Textarea
            my="8px"
            value={clauseText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setClauseText(e.target.value);
            }}
            textStyle="bodyRegular"
            h="300px"
          />
          <Checkbox
            size="md"
            isChecked={isRequired}
            colorScheme="green"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIsRequired(e.target.checked)
            }
          >
            Mark as a required section
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onEditModalClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={onEditConfirm}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WaiverSectionCard;
