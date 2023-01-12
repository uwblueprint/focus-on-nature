import React from "react";
import {
  Button,
  Checkbox,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react";
import { Camper } from "../../../../types/CamperTypes";
import { CampSession } from "../../../../types/CampsTypes";
import SelectCampersModal from "../../../common/SelectCampersModal";

type PageOneProps = {
  camper: Camper;
  retrievedCampers: Camper[];
  setCampersToBeMoved: React.Dispatch<React.SetStateAction<Set<Camper>>>
  campersToBeMoved: Set<Camper>;
  deselectAndClose: () => void;
  setModalPage: (page: number) => void;
};

const SelectModal = ({
  camper,
  retrievedCampers,
  setCampersToBeMoved,
  campersToBeMoved,
  deselectAndClose,
  setModalPage,
}: PageOneProps): JSX.Element => {

  const addCamperToBeMoved = (newCamper: Camper) => {
    setCampersToBeMoved(prevCampersToBeMoved => new Set(prevCampersToBeMoved.add(newCamper)));
  };

  const removeCamperToBeMoved = (oldCamper: Camper) => {
    setCampersToBeMoved(prevCampersToBeMoved => {
      const newSet = new Set(prevCampersToBeMoved);
      newSet.delete(oldCamper);
      return newSet
    });
  };

  const getTitle = () => {
    return "Move group members?"
  }

  const getDescription = () => {
    return `${camper.firstName} ${camper.lastName} was registered with the following
    group members. Please select all group members that you would like to
    move as well:`
  }

  const onNextPage = () => {
    setModalPage(2)
  }

  return <SelectCampersModal title={getTitle()} description={getDescription()} campersToBeSelected={campersToBeMoved} addCamperToBeSelected={addCamperToBeMoved} removeCamperToBeSeleted={removeCamperToBeMoved}
  onNextStep={onNextPage} deselectAndClose={deselectAndClose} retrievedCampers={retrievedCampers}/>
};

export default SelectModal;