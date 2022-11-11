import React, { useEffect } from "react";

import { ModalOverlay, ModalContent, Modal } from "@chakra-ui/react";
import { CampSession } from "../../../../types/CampsTypes";
import { Camper } from "../../../../types/CamperTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";

type MoveCamperModalProps = {
  camper: Camper;
  campSession: CampSession;
  campSessions: CampSession[];
  selectedCampSession: string;
  setSelectedCampSession: (campSession: string) => void;
  moveCampers: (camperIds: string[], campSessionId: string) => void;
  moveCamperModalIsOpen: boolean;
  moveCamperModalOnClose: () => void;
};

const MoveCamperModal = ({
  camper,
  campSession,
  campSessions,
  selectedCampSession,
  setSelectedCampSession,
  moveCampers,
  moveCamperModalIsOpen,
  moveCamperModalOnClose,
}: MoveCamperModalProps): JSX.Element => {
  const [modalPage, setModalPage] = React.useState<number>(1);
  const [campers, setCampers] = React.useState<Camper[]>([]);
  const [camperIsSelected, setCamperIsSelected] = React.useState<boolean[]>([]);

  const reset = () => {
    setModalPage(0);
    setCampers([]);
    setCamperIsSelected([]);
  };

  // Check if the camper has group members
  useEffect(() => {
    // Used to prevent the flash of previous state
    reset();

    // Check if the camper object is not null
    if (Object.keys(camper).length !== 0) {
      // Check if camper has group members
      CamperAPIClient.getCampersByChargeId(camper.chargeId).then(
        (campersByChargeId) => {
          if (campersByChargeId.length > 1) {
            setCampers(campersByChargeId);
            setCamperIsSelected(
              Array<boolean>(campersByChargeId.length).fill(true),
            );
            setModalPage(1);
          } else {
            setCampers([camper]);
            setCamperIsSelected(Array<boolean>(1).fill(true));
            setSelectedCampSession(
              campSessions.find(
                (campSessionItem) => campSessionItem.id !== camper.campSession,
              )?.id ?? selectedCampSession,
            );
            setModalPage(2);
          }
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camper, moveCamperModalIsOpen, campSession.camp]);

  const displayModalContent = () => {
    if (modalPage === 1) {
      return (
        <PageOne
          camper={camper}
          camperIsSelected={camperIsSelected}
          setCamperIsSelected={setCamperIsSelected}
          campers={campers}
          campSessions={campSessions}
          selectedCampSession={selectedCampSession}
          setSelectedCampSession={setSelectedCampSession}
          moveCamperModalOnClose={moveCamperModalOnClose}
          setModalPage={setModalPage}
        />
      );
    }
    if (modalPage === 2) {
      return (
        <PageTwo
          camper={camper}
          camperIsSelected={camperIsSelected}
          campers={campers}
          campSessions={campSessions}
          selectedCampSession={selectedCampSession}
          setSelectedCampSession={setSelectedCampSession}
          moveCamperModalOnClose={moveCamperModalOnClose}
          moveCampers={moveCampers}
        />
      );
    }
    return <></>;
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
