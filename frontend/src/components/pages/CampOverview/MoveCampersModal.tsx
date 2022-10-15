import React, { useEffect } from "react";

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Stack,
  Select,
} from "@chakra-ui/react";
import { CampSession } from "../../../types/CampsTypes";
import { Camper } from "../../../types/CamperTypes";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";

type MoveCamperModalProps = {
  camper: Camper;
  campSession: CampSession;
  moveCampers: (camperIds: string[], campSessionId: string) => void;
  moveCamperModalIsOpen: boolean;
  moveCamperModalOnClose: () => void;
};

const MoveCamperModal = ({
  camper,
  campSession,
  moveCampers,
  moveCamperModalIsOpen,
  moveCamperModalOnClose,
}: MoveCamperModalProps): JSX.Element => {
  const [modalPage, setModalPage] = React.useState<number>(1);
  const [campers, setCampers] = React.useState<Camper[]>([]);
  const [camperIsSelected, setCamperIsSelected] = React.useState<boolean[]>([]);
  const [campSessions, setCampSessions] = React.useState<CampSession[]>([]);
  const [selectedCampSession, setSelectedCampSession] = React.useState<string>(
    campSession.id,
  );

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
            setModalPage(2);
          }
        },
      );

      CampsAPIClient.getCampById(campSession.camp).then((camp) => {
        setCampSessions(camp.campSessions);
      });
    }
  }, [camper, moveCamperModalIsOpen, campSession.camp]);

  const displayModalContent = () => {
    if (modalPage === 1) {
      return (
        <>
          <ModalHeader>Move group members?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              {camper.firstName} {camper.lastName} was registered with the
              following group members. Please select all group members that you
              would like to move as well:
            </p>
            <Stack
              direction="column"
              alignItems="flex-start"
              mt="20px"
              maxH="60vh"
              overflowY="scroll"
            >
              <Checkbox
                className="camper-checkbox"
                isChecked={camperIsSelected.every(Boolean)}
                onChange={() => {
                  if (!camperIsSelected.every(Boolean)) {
                    setCamperIsSelected(
                      Array<boolean>(campers.length).fill(true),
                    );
                  } else {
                    setCamperIsSelected(
                      Array<boolean>(campers.length).fill(false),
                    );
                  }
                }}
              >
                Select all
              </Checkbox>
              {campers.map((campersItem, i) => (
                <Checkbox
                  className="camper-checkbox"
                  key={i}
                  isChecked={camperIsSelected[i]}
                  onChange={() => {
                    setCamperIsSelected(
                      camperIsSelected.map((camperItem, camperIdx) => {
                        if (camperIdx === i) {
                          return !camperItem;
                        }
                        return camperItem;
                      }),
                    );
                  }}
                >{`${campersItem.firstName} ${campersItem.lastName}`}</Checkbox>
              ))}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={moveCamperModalOnClose}>Cancel</Button>
            <Button
              variant="solid"
              style={{
                backgroundColor: "#468740",
                color: "white",
                marginLeft: "10px",
              }}
              onClick={() => {
                setModalPage(2);
              }}
              disabled={
                camperIsSelected.reduce<number>(
                  (prev, cur) => (cur ? prev + 1 : prev),
                  0,
                ) === 0
              }
            >
              Next
            </Button>
          </ModalFooter>
        </>
      );
    }
    if (modalPage === 2) {
      return (
        <>
          <ModalHeader>
            Move{" "}
            {camperIsSelected.reduce<number>(
              (prev, cur) => (cur ? prev + 1 : prev),
              0,
            )}{" "}
            Camper(s)
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p style={{ marginBottom: "20px" }}>
              You can move the camper(s) to another session in this camp by
              selecting it below:
            </p>
            {campSessions.length > 0 ? (
              <Select
                value={selectedCampSession}
                onChange={(e) => setSelectedCampSession(e.target.value)}
              >
                {campSessions.map((campSessionsItem, campSessionsIdx) => (
                  <option key={campSessionsIdx} value={campSessionsItem.id}>
                    <p>
                      Session {campSessionsIdx + 1}:{" "}
                      {new Date(campSessionsItem.dates[0]).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}{" "}
                      -{" "}
                      {new Date(
                        campSessionsItem.dates[1] ?? campSessionsItem.dates[0],
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      (
                      {campSessionsItem.capacity -
                        campSessionsItem.campers.length}{" "}
                      spots open)
                    </p>
                  </option>
                ))}
              </Select>
            ) : (
              <p>Error loading camp sessions.</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={moveCamperModalOnClose}>Cancel</Button>
            <Button
              variant="solid"
              style={{
                backgroundColor: "#468740",
                color: "white",
                marginLeft: "10px",
              }}
              onClick={() => {
                moveCampers(
                  campers.reduce<string[]>(
                    (prev, cur, idx) =>
                      camperIsSelected[idx] ? [...prev, cur.id] : prev,
                    [],
                  ),
                  selectedCampSession,
                );
                moveCamperModalOnClose();
              }}
            >
              Move
            </Button>
          </ModalFooter>
        </>
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
