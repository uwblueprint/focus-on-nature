import React from "react";

import {
  Box,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Checkbox,
  Stack,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

import { Camper } from "../../../../types/CamperTypes";

type RemoveCamperModalProps = {
  removeModalIsOpen: boolean;
  removeModalOnClose: () => void;
  camper: Camper;
};

const RemoveCamperModal = ({
  removeModalIsOpen,
  removeModalOnClose,
  camper,
}: RemoveCamperModalProps): JSX.Element => {
  const [checkedItems, setCheckedItems] = React.useState([false, false]);

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const [removeUsersPage, setRemoveUsersPage] = React.useState<boolean>(true);

  return (
    <Modal
      isOpen={removeModalIsOpen}
      onClose={removeModalOnClose}
      isCentered
      preserveScrollBarGap
      scrollBehavior="inside"
    >
      <ModalOverlay />

      {removeUsersPage ? (
        <ModalContent maxWidth="400px" maxHeight="80%">
          <ModalHeader ml={8} mr={8} pt={8} pb={4} pl={0} pr={0}>
            <Text textStyle="displaySmallerSemiBold">
              Remove group members?
            </Text>
          </ModalHeader>

          <ModalBody pl={8} pr={8} pb={0} pt={0}>
            <Box pt={4} pb={4}>
              <Text textStyle="displaySmallRegular">
                FirstName LastName registered with the following group members.
                Please select all the group members you would also like to
                remove from this session:{" "}
              </Text>

              <Stack mt={4}>
                <Checkbox
                  isChecked={allChecked}
                  isIndeterminate={isIndeterminate}
                  onChange={(e) =>
                    setCheckedItems([e.target.checked, e.target.checked])
                  }
                  mb={0}
                  colorScheme="green"
                >
                  Select all
                </Checkbox>

                <Checkbox
                  isChecked={checkedItems[0]}
                  onChange={(e) =>
                    setCheckedItems([e.target.checked, checkedItems[1]])
                  }
                  colorScheme="green"
                >
                  Child Checkbox 1
                </Checkbox>

                <Checkbox
                  isChecked={checkedItems[1]}
                  onChange={(e) =>
                    setCheckedItems([checkedItems[0], e.target.checked])
                  }
                  colorScheme="green"
                >
                  Child Checkbox 2
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter bg="camperModals.footer" borderRadius="8px">
            <Button variant="ghost" onClick={removeModalOnClose} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={() => setRemoveUsersPage(false)}
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : (
        <ModalContent maxWidth="400px" maxHeight="80%">
          <ModalHeader ml={8} mr={8} pt={8} pb={4} pl={0} pr={0}>
            <Text textStyle="displaySmallerSemiBold">
              Remove Camper(s) from Session
            </Text>
          </ModalHeader>

          <ModalBody pl={8} pr={8} pb={0} pt={0}>
            <Box pt={4} pb={4}>
              <Text textStyle="displaySmallRegular">
                Ensure that you have completed the following steps before
                removing the camper(s) from the camp session.
                <UnorderedList>
                  <ListItem>
                    Contacted the registrant to confirm that the camper(s)
                    is/are to be removed
                  </ListItem>
                  <ListItem>
                    Completed a full/partial refund or discussed an alternative
                    reimbursment
                  </ListItem>
                </UnorderedList>
              </Text>

              <Text textStyle="displaySmallBold" pt={4}>
                Note: this action is irreversible.
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter bg="camperModals.footer" borderRadius="8px">
            <Button
              variant="ghost"
              onClick={() => {
                removeModalOnClose();
                setRemoveUsersPage(true);
              }}
              mr={3}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                removeModalOnClose();
                setRemoveUsersPage(true);
              }}
            >
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default RemoveCamperModal;
