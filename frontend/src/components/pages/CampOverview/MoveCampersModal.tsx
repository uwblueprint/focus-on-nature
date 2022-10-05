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
  CheckboxGroup,
  useCheckboxGroup,
  Select,
  HStack,
} from "@chakra-ui/react";
import { CampSession } from "../../../types/CampsTypes";
import { Camper } from "../../../types/CamperTypes";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";

type MoveCamperModalProps = {
  camper: Camper;
  campSession: CampSession;
  moveCamperModalIsOpen: boolean;
  moveCamperModalOnClose: () => void;
};

const MoveCamperModal = ({
  camper,
  campSession,
  moveCamperModalIsOpen,
  moveCamperModalOnClose,
}: MoveCamperModalProps): JSX.Element => {
  const [modalPage, setModalPage] = React.useState<number>(1);
  const [campers, setCampers] = React.useState<Camper[]>([]);
  const [camperIsSelected, setCamperIsSelected] = React.useState<boolean[]>([]);
  const [campSessions, setCampSessions] = React.useState<CampSession[]>([]);

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
        console.log(campSession.camp);
        console.log(camp);
        setCampSessions(camp.campSessions);
      });
    }
  }, [camper, moveCamperModalIsOpen]);

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
          <ModalHeader>Move {campers.length} Camper(s)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              You can move the camper(s) to another session in this camp by
              selecting it below:
            </p>
            {campSessions.length > 0 ? (
              <Select>
                {campSessions.map((campSessionsItem, campSessionsIdx) => (
                  <option key={campSessionsIdx} value={campSessionsItem.id}>
                    <p>
                      Session {campSessionsIdx}:{" "}
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
                      ({campSessionsItem.capacity} spots open)
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
                // TODO: Move camper(s) to selected session
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
