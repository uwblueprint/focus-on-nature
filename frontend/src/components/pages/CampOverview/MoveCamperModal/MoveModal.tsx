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
            {campSessions.map((campSessionsItem, campSessionsIdx) => {
              const earliestSessionDate = new Date(
                campSessionsItem.dates.reduce(
                  (earliest, date) =>
                    earliest < new Date(date) ? earliest : new Date(date),
                  new Date(Infinity),
                ),
              );
              const latestSessionDate = new Date(
                campSessionsItem.dates.reduce(
                  (earliest, date) =>
                    earliest > new Date(date) ? earliest : new Date(date),
                  new Date(-Infinity),
                ),
              );
              return (
                <option
                  key={campSessionsIdx}
                  value={campSessionsItem.id}
                  disabled={
                    campSessionsItem.id === camper.campSession ||
                    campSessionsItem.capacity -
                      campSessionsItem.campers.length <
                      campersToBeMoved.length ||
                    earliestSessionDate < new Date()
                  }
                >
                  Session {campSessionsIdx + 1}:{" "}
                  {earliestSessionDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {latestSessionDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  ({campSessionsItem.capacity - campSessionsItem.campers.length}{" "}
                  spots open)
                </option>
              );
            })}
          </Select>
        ) : (
          <p>Error loading camp sessions.</p>
        )}
      </ModalBody>

      <ModalFooter>
        <Button onClick={deselectAndClose}>Cancel</Button>
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
