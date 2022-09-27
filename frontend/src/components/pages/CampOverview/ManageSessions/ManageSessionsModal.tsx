import React, { useState } from "react";
import {
  Box,
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
import { ManageCampSessionDetails } from "../../../../types/CampsTypes";
import ManageSessionsModalTable from "./ManageSessionModalTable";
  
interface ManageSessionsModalProps {
  sessions: Array<ManageCampSessionDetails>;
  onDeleteSessions: (sessions: Array<ManageCampSessionDetails>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ManageSessionsModal = ({
  sessions,
  onDeleteSessions,
  isOpen,
  onClose,
}: ManageSessionsModalProps): JSX.Element => {
  const [sessionsToDelete, setSessionsToDelete] = useState<Array<ManageCampSessionDetails>>([]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      {/* TODO figure out width attribute here */}
      <ModalContent pt={5} w="1000px">
        <ModalHeader ml={5} textStyle="heading" w="inherit">
          <Text>Manage Camp Sessions</Text>
        </ModalHeader>
        <ModalBody w="inherit">
          {
              sessions.length === 0 ? 
              <Text>No sessions to edit</Text> : 
              <ManageSessionsModalTable
                sessions={sessions}
                onEditCapacity={(updatedSession) => console.log(updatedSession)}
                onClickDeleteSession={(session) => setSessionsToDelete([...sessionsToDelete, session])}
              />
          }
        </ModalBody>
        <ModalFooter w="inherit">
          <HStack>
            <Button mr={3} onClick={onClose}>
              <Text>Cancel</Text>
            </Button>
            {/* TODO implement onDelete */}
            <Button colorScheme="green" onClick={() => onDeleteSessions([])}>
              Save Changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManageSessionsModal;
  