import React from "react";

import {
  Box,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

import { Camper } from "../../../../types/CamperTypes";

type ConfirmModalProps = {
  allCampersToBeDeleted: Camper[];
  deselectAndClose: () => void;
  submitDeletion: () => void;
};

const ConfirmModal = ({
  allCampersToBeDeleted,
  deselectAndClose,
  submitDeletion,
}: ConfirmModalProps): JSX.Element => {
  return (
    <ModalContent maxWidth="400px" maxHeight="80%">
      <ModalHeader ml={8} mr={8} pt={8} pb={4} pl={0} pr={0}>
        <Text textStyle="buttonSemiBold">Remove Camper(s) from Session</Text>
      </ModalHeader>

      <ModalBody pl={8} pr={8} pb={0} pt={0}>
        <Box pt={4} pb={4}>
          <Text textStyle="bodyRegular">
            Ensure that you have completed the following steps before removing
            the camper(s) from the camp session.
          </Text>
          <UnorderedList pt={2}>
            <ListItem>
              Contacted the registrant to confirm that the camper(s) is/are to
              be removed
            </ListItem>
            <ListItem>
              Completed a full/partial refund or discussed an alternative
              reimbursment
            </ListItem>
          </UnorderedList>

          <Text textStyle="bodyRegular" pt={6}>
            The following campers are scheduled for deletion:
          </Text>
          <UnorderedList pt={2}>
            {allCampersToBeDeleted.map((currentCamper: Camper) => {
              return (
                <ListItem key={currentCamper.id}>
                  {currentCamper.firstName} {currentCamper.lastName}
                </ListItem>
              );
            })}
          </UnorderedList>

          <Text textStyle="buttonSemiBold" pt={4}>
            Note: this action is irreversible.
          </Text>
        </Box>
      </ModalBody>
      <ModalFooter bg="camperModals.footer" borderRadius="8px">
        <Button variant="ghost" onClick={deselectAndClose} mr={3}>
          Cancel
        </Button>
        <Button
          colorScheme="secondary.critical"
          onClick={() => {
            submitDeletion();
            deselectAndClose();
          }}
        >
          Remove
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default ConfirmModal;
