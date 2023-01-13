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
import { Camper } from "../../types/CamperTypes";

type SelectCampersModalProps = {
  title: string;
  description: string;
  campersToBeSelected: Set<Camper>;
  retrievedCampers: Camper[];
  addCamperToBeSelected: (camper: Camper) => void;
  removeCamperToBeSeleted: (camper: Camper) => void;
  deselectAndClose: () => void;
  onNextStep: () => void;
};

const SelectCampersModal = ({
  title,
  description,
  campersToBeSelected,
  retrievedCampers,
  addCamperToBeSelected,
  removeCamperToBeSeleted,
  deselectAndClose,
  onNextStep,
}: SelectCampersModalProps): JSX.Element => {
  const addAllCampers = () => {
    retrievedCampers.forEach((currentCamper: Camper) =>
      addCamperToBeSelected(currentCamper),
    );
  };

  const removeAllCampers = () => {
    retrievedCampers.forEach((currentCamper: Camper) =>
      removeCamperToBeSeleted(currentCamper),
    );
  };

  return (
    <ModalContent maxWidth="400px" maxHeight="80%">
      <ModalHeader ml={8} mr={8} pt={8} pb={4} pl={0} pr={0}>
        <Text textStyle="buttonSemiBold">{title}</Text>
      </ModalHeader>

      <ModalBody pl={8} pr={8} pb={0} pt={0}>
        <Box pt={4} pb={4}>
          <Text textStyle="bodyRegular">{description}</Text>

          <Stack mt={4}>
            <Checkbox
              isChecked={campersToBeSelected.size === retrievedCampers.length}
              isIndeterminate={
                campersToBeSelected.size > 0 &&
                campersToBeSelected.size !== retrievedCampers.length
              }
              onChange={() =>
                campersToBeSelected.size < retrievedCampers.length
                  ? addAllCampers()
                  : removeAllCampers()
              }
              mb={0}
              variant="primary"
            >
              Select all
            </Checkbox>

            {retrievedCampers.map((currentCamper: Camper) => {
              return (
                <Checkbox
                  key={currentCamper.id}
                  isChecked={campersToBeSelected.has(currentCamper)}
                  onChange={() =>
                    campersToBeSelected.has(currentCamper)
                      ? removeCamperToBeSeleted(currentCamper)
                      : addCamperToBeSelected(currentCamper)
                  }
                  variant="primary"
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
        <Button variant="primary" onClick={onNextStep}>
          Next
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SelectCampersModal;
