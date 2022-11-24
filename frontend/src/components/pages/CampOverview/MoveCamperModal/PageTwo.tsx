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
  camperIsSelected: boolean[];
  campers: Camper[];
  campSessions: CampSession[];
  selectedCampSession: string;
  setSelectedCampSession: (campSession: string) => void;
  moveCamperModalOnClose: () => void;
  moveCampers: (camperIds: string[], campSessionId: string) => void;
};

const PageTwo = ({
  camper,
  camperIsSelected,
  campers,
  campSessions,
  selectedCampSession,
  setSelectedCampSession,
  moveCamperModalOnClose,
  moveCampers,
}: PageTwoProps): JSX.Element => {
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
              <option
                key={campSessionsIdx}
                value={campSessionsItem.id}
                disabled={
                  campSessionsItem.id === camper.campSession ||
                  campSessionsItem.capacity - campSessionsItem.campers.length <
                    camperIsSelected.reduce<number>(
                      (prev, cur) => (cur ? prev + 1 : prev),
                      0,
                    ) ||
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
};

export default PageTwo;
