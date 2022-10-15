import React from "react";

import {
  Box,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Checkbox,
  Stack,
} from "@chakra-ui/react";

import { Camper } from "../../../../types/CamperTypes";

type SelectModalProps = {
  camper: Camper;
  campersToBeDeleted: Set<Camper>;
  setCampersToBeDeleted: React.Dispatch<React.SetStateAction<Set<Camper>>>;
  retrievedCampers: Camper[];
  deselectAndClose: () => void;
  setStatusAsConfirm: () => void;
};

const SelectModal = ({
  camper,
  campersToBeDeleted,
  setCampersToBeDeleted,
  retrievedCampers,
  deselectAndClose,
  setStatusAsConfirm,
}: SelectModalProps): JSX.Element => {
  const addCamperToBeDeleted = (newCamper: Camper) => {
    setCampersToBeDeleted(new Set(campersToBeDeleted.add(newCamper)));
  };

  const removeCamperToBeDeleted = (oldCamper: Camper) => {
    const newSet = new Set(campersToBeDeleted);
    newSet.delete(oldCamper);
    setCampersToBeDeleted(newSet);
  };

  const addAllCampers = () => {
    const newSet = new Set<Camper>();

    retrievedCampers.forEach((currentCamper: Camper) =>
      newSet.add(currentCamper),
    );

    setCampersToBeDeleted(newSet);
  };

  return (
    <ModalContent maxWidth="400px" maxHeight="80%">
      <ModalHeader ml={8} mr={8} pt={8} pb={4} pl={0} pr={0}>
        <Text textStyle="buttonSemiBold">Remove group members?</Text>
      </ModalHeader>

      <ModalBody pl={8} pr={8} pb={0} pt={0}>
        <Box pt={4} pb={4}>
          <Text textStyle="bodyRegular">
            {camper.firstName} {camper.lastName} registered with the following
            group members. Please select all the group members you would also
            like to remove from this session:{" "}
          </Text>

          <Stack mt={4}>
            <Checkbox
              isChecked={campersToBeDeleted.size === retrievedCampers.length}
              isIndeterminate={
                campersToBeDeleted.size > 0 &&
                campersToBeDeleted.size !== retrievedCampers.length
              }
              onChange={() =>
                campersToBeDeleted.size < retrievedCampers.length
                  ? addAllCampers()
                  : setCampersToBeDeleted(new Set<Camper>())
              }
              mb={0}
              colorScheme="green"
            >
              Select all
            </Checkbox>

            {retrievedCampers.map((currentCamper: Camper) => {
              return (
                <Checkbox
                  key={currentCamper.id}
                  isChecked={campersToBeDeleted.has(currentCamper)}
                  onChange={() =>
                    campersToBeDeleted.has(currentCamper)
                      ? removeCamperToBeDeleted(currentCamper)
                      : addCamperToBeDeleted(currentCamper)
                  }
                  colorScheme="green"
                >
                  {currentCamper.firstName} {currentCamper.lastName}
                </Checkbox>
              );
            })}
          </Stack>
        </Box>
      </ModalBody>
      <ModalFooter bg="camperModals.footer" borderRadius="8px">
        <Button variant="ghost" onClick={deselectAndClose} mr={3}>
          Cancel
        </Button>
        <Button colorScheme="primary.green" onClick={setStatusAsConfirm}>
          Next
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SelectModal;
