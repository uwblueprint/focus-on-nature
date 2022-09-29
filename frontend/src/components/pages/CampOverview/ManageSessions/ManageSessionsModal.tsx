import React, { useState } from "react";
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
import { ManageCampSessionDetails } from "../../../../types/CampsTypes";
import ManageSessionsModalTable from "./ManageSessionsModalTable";

interface ManageSessionsModalProps {
  campStartTime: string;
  campEndTime: string;
  sessions: Array<ManageCampSessionDetails>;
  onSaveChanges: (
    deletedSessions: Set<string>,
    updatedCapacities: Map<string, number | undefined>,
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ManageSessionsModal = ({
  campStartTime,
  campEndTime,
  sessions,
  onSaveChanges,
  isOpen,
  onClose,
}: ManageSessionsModalProps): JSX.Element => {
  const [deletedCampSessionIds, setDeletedCampSessionIds] = useState<
    Set<string>
  >(new Set());
  const [updatedSessionIdCapacity, setUpdatedSessionIdCapacity] = useState<
    Map<string, number | undefined>
  >(new Map());

  const closeModalAndClearChanges = () => {
    setDeletedCampSessionIds(new Set());
    setUpdatedSessionIdCapacity(new Map());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModalAndClearChanges} isCentered>
      <ModalOverlay />
      <ModalContent pt={5} minW="800px">
        <ModalHeader ml={6} textStyle="heading">
          <Text>Manage Camp Sessions</Text>
        </ModalHeader>
        <ModalBody>
          {sessions.length === 0 ? (
            <Text>No sessions to edit</Text>
          ) : (
            <ManageSessionsModalTable
              campStartTime={campStartTime}
              campEndTime={campEndTime}
              sessions={sessions}
              deletedSessions={deletedCampSessionIds}
              updatedCapacities={updatedSessionIdCapacity}
              onEditCapacity={(updatedSession, updatedCapacity) => {
                // TODO check for duplicate calls (user types back in original capacity)
                setUpdatedSessionIdCapacity(
                  new Map(
                    updatedSessionIdCapacity.set(
                      updatedSession.id,
                      updatedCapacity
                        ? parseInt(updatedCapacity, 10)
                        : undefined,
                    ),
                  ),
                );
              }}
              onClickDeleteSession={(session) => {
                if (deletedCampSessionIds.has(session.id)) {
                  const newSet = new Set(deletedCampSessionIds);
                  newSet.delete(session.id);
                  setDeletedCampSessionIds(newSet);
                } else {
                  setDeletedCampSessionIds(
                    new Set(deletedCampSessionIds.add(session.id)),
                  );
                }
              }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3} mr={6}>
            <Button
              color="primary.green.100"
              variant="outline"
              onClick={closeModalAndClearChanges}
            >
              <Text>Cancel</Text>
            </Button>
            {/* TODO implement onSave */}
            <Button
              colorScheme="green"
              onClick={() => {
                onSaveChanges(deletedCampSessionIds, updatedSessionIdCapacity);
                closeModalAndClearChanges();
              }}
            >
              Save Changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManageSessionsModal;
