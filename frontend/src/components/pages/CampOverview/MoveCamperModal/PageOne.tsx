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

type PageOneProps = {
  camper: Camper;
  camperIsSelected: boolean[];
  setCamperIsSelected: (camperIsSelected: boolean[]) => void;
  campers: Camper[];
  campSessions: CampSession[];
  selectedCampSession: string;
  setSelectedCampSession: (campSession: string) => void;
  moveCamperModalOnClose: () => void;
  setModalPage: (page: number) => void;
};

const PageOne = ({
  camper,
  camperIsSelected,
  setCamperIsSelected,
  campers,
  campSessions,
  selectedCampSession,
  setSelectedCampSession,
  moveCamperModalOnClose,
  setModalPage,
}: PageOneProps): JSX.Element => {
  return (
    <>
      <ModalHeader>Move group members?</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <p>
          {camper.firstName} {camper.lastName} was registered with the following
          group members. Please select all group members that you would like to
          move as well:
        </p>
        <Stack
          direction="column"
          alignItems="flex-start"
          mt="20px"
          maxH="60vh"
          overflowY="scroll"
          padding="0 10px 0 10px"
        >
          <Checkbox
            colorScheme="green"
            isChecked={camperIsSelected.every(Boolean)}
            onChange={() => {
              if (!camperIsSelected.every(Boolean)) {
                setCamperIsSelected(Array<boolean>(campers.length).fill(true));
              } else {
                const newArray = Array<boolean>(campers.length).fill(false);
                newArray[
                  campers.map((camperItem) => camperItem.id).indexOf(camper.id)
                ] = true;
                setCamperIsSelected(newArray);
              }
            }}
          >
            Select all
          </Checkbox>
          {campers.map((campersItem, i) =>
            campersItem.id !== camper.id ? (
              <Checkbox
                colorScheme="green"
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
            ) : null,
          )}
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
            setSelectedCampSession(
              campSessions.find(
                (campSessionItem) => campSessionItem.id !== camper.campSession,
              )?.id ?? selectedCampSession,
            );
            setModalPage(2);
          }}
        >
          Next
        </Button>
      </ModalFooter>
    </>
  );
};

export default PageOne;
