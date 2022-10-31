import React from "react";
import { Text, Box, Flex, HStack, Spacer, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
 Button, Textarea, Checkbox } from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";

interface WaiverSectionCardProps {
  clauseIdx: number;
  clauseData: WaiverClause;
  onEditWaiverSection: (clauseText: string, clauseIsRequired: boolean, clauseIdx: number) => void;
  onDeleteWaiverSection: (idx: number) => void;
}
const WaiverSectionCard = ({
  clauseIdx,
  clauseData,
  onEditWaiverSection,
  onDeleteWaiverSection,
}: WaiverSectionCardProps): JSX.Element => {
  function getSectionTitle(number: number) {
    const code = "A".charCodeAt(0);
    return `Section ${String.fromCharCode(code + number)}`;
  }

  const [clauseText, setClauseText] = React.useState(clauseData.text)
  const [isRequired, setIsRequired] = React.useState(clauseData.required)
  const [isDeleteOpen, setDeleteOpen] = React.useState(false)
  const [isEditOpen, setEditOpen] = React.useState(false)

  function onDeleteOpen() {
    setDeleteOpen(true)
  }
  function onDeleteClose() {
    setDeleteOpen(false)
  }

  function onDeleteConfirm() {
    onDeleteWaiverSection(clauseIdx)
    setDeleteOpen(false)
  }

  function onEditOpen() {
    setEditOpen(true)
  }
  function onEditClose() {
    setEditOpen(false)
  }

  function onEditConfirm() {
    onEditWaiverSection(clauseText, isRequired, clauseIdx)
    setEditOpen(false)
  }


  return (
    <>
    <Box px="32px" pt="20px" pb="22px" bg="background.grey.100" my="12px">
      <Flex pb="14px">
        <HStack spacing="20px">
          <Text textStyle="displaySmallSemiBold">
            {getSectionTitle(clauseIdx)}
          </Text>
          {clauseData.required && (
            <Text
              borderRadius="50px"
              px={4}
              bg="background.required.100"
              color="text.critical.100"
            >
              required
            </Text>
          )}
        </HStack>
        <Spacer />
        <HStack spacing="20px">
          <Text textStyle="buttonSemiBold" _hover={{cursor: "pointer" }} onClick={onEditOpen} color="text.success.100">
            Edit
          </Text>
          <Text textStyle="buttonSemiBold" _hover={{cursor: "pointer" }} onClick={onDeleteOpen} color="text.critical.100">
            Delete
          </Text>
        </HStack>
      </Flex>
      <Text>{clauseData.text}</Text>
    </Box>
    <>
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
      <ModalOverlay />
        <ModalContent>
          <ModalHeader><Text textStyle="heading">
          Edit waiver section
          </Text></ModalHeader>
          <ModalBody>
            <Text textStyle="bodyRegular">Edit waiver</Text>
            <Textarea
              value={clauseText}
              onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => { setClauseText(e.target.value)}}
              textStyle="bodyRegular"
              h="300px"
            />
            <Checkbox size='md' isChecked={isRequired} colorScheme='green' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsRequired(e.target.checked)}>
            Mark as a required section
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme='green' onClick={onEditConfirm}> Save </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
    <ModalOverlay />
        <ModalContent>
          <ModalHeader><Text textStyle="heading">
          Delete waiver section? 
          </Text></ModalHeader>
          <ModalBody>
          <Text textStyle="bodyRegular">Are you sure you want to delete this waiver section?</Text>

         <Text textStyle="bodyBold">Note: this action is irreversible.</Text>
          </ModalBody>

          <ModalFooter>
          <Button mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={onDeleteConfirm}> Remove </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  );
};

export default WaiverSectionCard;
