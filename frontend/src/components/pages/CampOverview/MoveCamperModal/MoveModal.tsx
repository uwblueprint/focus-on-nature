import React from "react";
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Select,
} from "@chakra-ui/react";
import { Camper } from "../../../../types/CamperTypes";
import { CampSession } from "../../../../types/CampsTypes";

type PageTwoProps = {
  camper: Camper;
  campersToBeMoved: Camper[];
  campSessions: CampSession[];
  selectedCampSession: string;
  setSelectedCampSession: (campSession: string) => void;
  deselectAndClose: () => void;
  moveCampers: () => void;
};

const MoveModal = ({
  camper,
  campersToBeMoved,
  campSessions,
  selectedCampSession,
  setSelectedCampSession,
  deselectAndClose,
  moveCampers,
}: PageTwoProps): JSX.Element => {
  return (
    <>
      <ModalHeader>Move {campersToBeMoved.length} Camper(s)</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <p style={{ marginBottom: "20px" }}>
          You can move the camper(s) to another session in this camp by
          selecting it below:
        </p>
        {campSessions.length > 0 ? (
          <Select
            placeholder="Choose an option"
            value={selectedCampSession}
            onChange={(e) => setSelectedCampSession(e.target.value)}
          >
            {campSessions.map((campSessionsItem, campSessionsIdx) => (
              <option
                key={campSessionsIdx}
                value={campSessionsItem.id}
                disabled={
                  campSessionsItem.id === camper.campSession ||
                  campSessionsItem.capacity - campSessionsItem.campers.length <
                    campersToBeMoved.length ||
                  new Date(campSessionsItem.dates[1]) < new Date()
                }
              >
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
                ({campSessionsItem.capacity - campSessionsItem.campers.length}{" "}
                spots open)
              </option>
            ))}
          </Select>
        ) : (
          <p>Error loading camp sessions.</p>
        )}
      </ModalBody>

      <ModalFooter>
        <Button onClick={() => deselectAndClose}>Cancel</Button>
        <Button
          variant="solid"
          style={{
            backgroundColor: "#468740",
            color: "white",
            marginLeft: "10px",
          }}
          isDisabled={!selectedCampSession}
          onClick={() => {
            moveCampers();
            deselectAndClose();
          }}
        >
          Move
        </Button>
      </ModalFooter>
    </>
  );
};

export default MoveModal;
