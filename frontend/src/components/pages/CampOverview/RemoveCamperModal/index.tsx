import React, { useState, useEffect } from "react";

import { ModalOverlay, Modal, useToast } from "@chakra-ui/react";

import { Camper } from "../../../../types/CamperTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import SelectModal from "./SelectModal";
import ConfirmModal from "./ConfirmModal";

// An enum to keep track of the two modal states.
export enum ModalStatus {
  SELECT = "select",
  CONFIRM = "confirm",
}

type RemoveCamperModalProps = {
  removeModalIsOpen: boolean;
  removeModalOnClose: () => void;
  camper: Camper;
  handleRefetch: () => void;
};

const RemoveCamperModal = ({
  removeModalIsOpen,
  removeModalOnClose,
  camper,
  handleRefetch,
}: RemoveCamperModalProps): JSX.Element => {
  const toast = useToast();
  const [modalStatus, setModalStatus] = useState<ModalStatus>(
    ModalStatus.SELECT,
  );
  const [retrievedCampers, setRetrievedCampers] = useState<Camper[]>([]);
  const [campersToBeDeleted, setCampersToBeDeleted] = useState<Set<Camper>>(
    new Set<Camper>(),
  );

  const allCampersToBeDeleted: Camper[] = Array.from(
    campersToBeDeleted,
  ) as Camper[];
  allCampersToBeDeleted.push(camper);

  const [loading, setLoading] = useState(true);

  // Fetch the data, only refetching when a new camper has been selected.
  useEffect(() => {
    const getCampersByChargeIdAndSessionId = async (selectedCamper: Camper) => {
      setLoading(true);
      const getResponse: Camper[] = await CamperAPIClient.getCampersByChargeIdAndSessionId(
        selectedCamper.chargeId,
        selectedCamper.campSession,
      );
      if (getResponse) {
        setRetrievedCampers(
          getResponse.filter(
            (currentCamper: Camper) => currentCamper.id !== camper.id,
          ),
        );
        setLoading(false);
      } else {
        toast({
          description: `Unable to retrieve camper information.`,
          status: "error",
          duration: 3000,
          variant: "subtle",
        });
      }
    };
    getCampersByChargeIdAndSessionId(camper);

    return () => {
      setRetrievedCampers([]);
      setCampersToBeDeleted(new Set<Camper>());
    };
  }, [camper]);

  const deselectAndClose = () => {
    setCampersToBeDeleted(new Set<Camper>());
    setModalStatus(ModalStatus.SELECT);
    removeModalOnClose();
  };

  const deletionMessage = () => {
    if (allCampersToBeDeleted.length >= 2) {
      let returnString = `${allCampersToBeDeleted[0].firstName} ${allCampersToBeDeleted[0].lastName}, `;
      for (let i = 1; i < allCampersToBeDeleted.length - 1; i += 1) {
        returnString += `${allCampersToBeDeleted[i].firstName} ${allCampersToBeDeleted[i].lastName}, `;
      }
      returnString += `and ${
        allCampersToBeDeleted[allCampersToBeDeleted.length - 1].firstName
      } ${
        allCampersToBeDeleted[allCampersToBeDeleted.length - 1].lastName
      } have been removed.`;
      return returnString;
    }
    return `${allCampersToBeDeleted[0].firstName} ${allCampersToBeDeleted[0].lastName} has been removed.`;
  };

  // Delete the selected campers.
  const submitDeletion = async () => {
    const deletionResponse = await CamperAPIClient.deleteMultipleCampersById(
      allCampersToBeDeleted.map((currentCamper: Camper) => currentCamper.id),
    );

    if (deletionResponse) {
      toast({
        description: deletionMessage(),
        status: "success",
        duration: 3000,
        variant: "subtle",
      });
    } else {
      toast({
        description: `Unable to remove the selected campers.`,
        status: "error",
        duration: 3000,
        variant: "subtle",
      });
    }
    handleRefetch();
  };

  return (
    <Modal
      isOpen={removeModalIsOpen}
      onClose={deselectAndClose}
      isCentered
      preserveScrollBarGap
      scrollBehavior="inside"
    >
      <ModalOverlay />

      {modalStatus === ModalStatus.SELECT &&
        retrievedCampers.length > 0 &&
        !loading && (
          <SelectModal
            camper={camper}
            campersToBeDeleted={campersToBeDeleted}
            setCampersToBeDeleted={setCampersToBeDeleted}
            retrievedCampers={retrievedCampers}
            deselectAndClose={deselectAndClose}
            setStatusAsConfirm={() => setModalStatus(ModalStatus.CONFIRM)}
          />
        )}

      {(modalStatus === ModalStatus.CONFIRM || retrievedCampers.length === 0) &&
        !loading && (
          <ConfirmModal
            allCampersToBeDeleted={allCampersToBeDeleted}
            deselectAndClose={deselectAndClose}
            submitDeletion={submitDeletion}
          />
        )}
    </Modal>
  );
};

export default RemoveCamperModal;
