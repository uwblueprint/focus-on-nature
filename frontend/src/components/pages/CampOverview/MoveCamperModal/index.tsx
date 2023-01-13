import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  ModalOverlay,
  ModalContent,
  Modal,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { CampSession } from "../../../../types/CampsTypes";
import { Camper } from "../../../../types/CamperTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import CampsAPIClient from "../../../../APIClients/CampsAPIClient";
import SelectModal from "./SelectModal";
import MoveModal from "./MoveModal";

type MoveCamperModalProps = {
  camper: Camper;
  moveCamperModalIsOpen: boolean;
  moveCamperModalOnClose: () => void;
  handleRefetch: () => void;
  deleteActionCleanUp: () => void;
};

const MoveCamperModal = ({
  camper,
  moveCamperModalIsOpen,
  moveCamperModalOnClose,
  handleRefetch,
  deleteActionCleanUp,
}: MoveCamperModalProps): JSX.Element => {
  const [additionalCampersToBeMoved, setCampersToBeMoved] = React.useState<
    Set<Camper>
  >(new Set());
  const [retrievedCampers, setRetrievedCampers] = React.useState<Camper[]>([]);
  const [modalPage, setModalPage] = React.useState<number>(0);
  const [campSessions, setCampSessions] = React.useState<CampSession[]>([]);
  const [selectedCampSession, setSelectedCampSession] = React.useState<string>(
    "",
  );
  const { id: campId } = useParams<{ id: string }>();
  const toast = useToast();

  const allCampersToBeMoved: Camper[] = Array.from(
    additionalCampersToBeMoved,
  ) as Camper[];
  allCampersToBeMoved.push(camper);

  // Clear the modal state
  const deselectAndClose = () => {
    setCampersToBeMoved(new Set());
    setRetrievedCampers([]);
    setSelectedCampSession("");
    moveCamperModalOnClose();
  };

  useEffect(() => {
    // Check if camper has group members
    CamperAPIClient.getCampersByChargeIdAndSessionId(
      camper.chargeId,
      camper.campSession,
    ).then((campersByChargeId) => {
      if (campersByChargeId.length > 1) {
        setRetrievedCampers(
          campersByChargeId.filter(
            (currentCamper: Camper) => currentCamper.id !== camper.id,
          ),
        );
        setModalPage(1);
      } else {
        setRetrievedCampers([]);
        setModalPage(2);
      }
    });

    // Get the sessions of the camp
    CampsAPIClient.getCampById(campId).then((campResponse) => {
      setCampSessions(campResponse.campSessions);
    });

    return () => {
      setModalPage(0);
    };
  }, [camper, campId]);

  const moveMessage = () => {
    if (allCampersToBeMoved.length >= 2) {
      let returnString = "";
      for (let i = 0; i < allCampersToBeMoved.length - 1; i += 1) {
        returnString += `${allCampersToBeMoved[i].firstName} ${allCampersToBeMoved[i].lastName}, `;
      }
      returnString += `and ${
        allCampersToBeMoved[allCampersToBeMoved.length - 1].firstName
      } ${
        allCampersToBeMoved[allCampersToBeMoved.length - 1].lastName
      } have been removed.`;
      return returnString;
    }
    return `${allCampersToBeMoved[0].firstName} ${allCampersToBeMoved[0].lastName} has been moved.`;
  };

  const moveCampers = async () => {
    await CamperAPIClient.updateCampersById(
      allCampersToBeMoved.map((currentCamper: Camper) => currentCamper.id),
      { campSession: selectedCampSession },
    );
    toast({
      description: moveMessage(),
      status: "success",
      duration: 3000,
      variant: "subtle",
    });
    handleRefetch();
    deleteActionCleanUp();
  };

  const displayModalContent = () => {
    if (modalPage === 1) {
      return (
        <SelectModal
          camper={camper}
          retrievedCampers={retrievedCampers}
          setCampersToBeMoved={setCampersToBeMoved}
          campersToBeMoved={additionalCampersToBeMoved}
          deselectAndClose={deselectAndClose}
          setModalPage={setModalPage}
        />
      );
    }
    if (modalPage === 2) {
      return (
        <MoveModal
          camper={camper}
          campersToBeMoved={allCampersToBeMoved}
          campSessions={campSessions}
          deselectAndClose={deselectAndClose}
          setSelectedCampSession={setSelectedCampSession}
          selectedCampSession={selectedCampSession}
          moveCampers={moveCampers}
        />
      );
    }
    return (
      <Center bg="background.white.100" p="30px">
        <Spinner />
      </Center>
    );
  };

  return (
    <Modal
      isOpen={moveCamperModalIsOpen}
      onClose={moveCamperModalOnClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>{displayModalContent()}</ModalContent>
    </Modal>
  );
};

export default MoveCamperModal;
