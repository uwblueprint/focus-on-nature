import React from "react";

import {
  Box,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { Camper } from "../../../../types/CamperTypes";
import { CamperDetailsBadgeGroup } from "../CampersTable/CamperDetailsBadge";
import PickupDropoffTable from "./PickupDropoffTable";

type ViewCamperModalProps = {
  viewCamperModalIsOpen: boolean;
  viewCamperOnClose: () => void;
  camper: Camper;
};

const ViewCamperModal = ({
  viewCamperModalIsOpen,
  viewCamperOnClose,
  camper,
}: ViewCamperModalProps): JSX.Element => {
  return (
    <Modal
      isOpen={viewCamperModalIsOpen}
      onClose={viewCamperOnClose}
      isCentered
      preserveScrollBarGap
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxWidth="600px" maxHeight="80%">
        <ModalHeader
          ml={8}
          mr={8}
          pt={8}
          pb={4}
          pl={0}
          pr={0}
          borderBottom="1px"
          borderColor="camperModals.border"
        >
          <Text textStyle="displayLarge">
            {`${camper.firstName} ${camper.lastName}`}
            <Text as="span" fontWeight="400">
              | {`Age: ${camper.age}`}
            </Text>
          </Text>
          <Text textStyle="displaySmallRegular" pb={2}>
            Amount Paid: $
            {Object.values(camper.charges).reduce(
              (prevTotal, curCharge) => prevTotal + curCharge,
            )}
          </Text>
          <CamperDetailsBadgeGroup camper={camper} paddingLeft="0px" />
        </ModalHeader>

        <ModalBody pl={8} pr={8} pb={0} pt={0}>
          <Box
            pt={4}
            pb={4}
            borderBottom="1px"
            borderColor="camperModals.border"
          >
            <Text textStyle="displaySmallBold" pb={2}>
              Earliest Drop-off and Latest Pick-up
            </Text>
            <PickupDropoffTable
              earlyDropoff={camper.earlyDropoff}
              latePickup={camper.latePickup}
            />
          </Box>

          <Box
            pt={4}
            pb={4}
            borderBottom="1px"
            borderColor="camperModals.border"
          >
            <Text textStyle="displaySmallBold" pb={2}>
              Camper Information
            </Text>
            <Text textStyle="bodyBold" pt={2} pb={2}>
              Allergies
            </Text>
            <Textarea
              isDisabled
              textStyle="bodyRegular"
              size="sm"
              resize="none"
              borderColor="camperModals.disabled"
              color="black"
              placeholder={
                camper.allergies ? camper.allergies : "No allergies specified."
              }
              _placeholder={{ color: "black" }}
            />
            <Text textStyle="bodyBold" pt={4} pb={2}>
              Special Needs
            </Text>
            <Textarea
              isDisabled
              textStyle="bodyRegular"
              size="sm"
              resize="none"
              borderColor="camperModals.disabled"
              color="black"
              placeholder={
                camper.specialNeeds
                  ? camper.specialNeeds
                  : "No additional needs specified."
              }
              _placeholder={{ color: "black" }}
            />
          </Box>

          <Box pt={4} pb={4}>
            <Text textStyle="displaySmallBold">Camp Specific Questions</Text>
            {camper.formResponses &&
            Object.entries(camper.formResponses).length > 0 ? (
              Object.entries(camper.formResponses).map((response, i) => {
                return (
                  <Box as="span" key={`formResponse_${i}`}>
                    <Text textStyle="bodyBold" pt={4}>
                      {response[0]}
                    </Text>
                    <Text textStyle="bodyRegular">{response[1]}</Text>
                  </Box>
                );
              })
            ) : (
              <Text textStyle="bodyRegular">No responses found.</Text>
            )}
          </Box>
        </ModalBody>
        <ModalFooter bg="camperModals.footer" borderRadius="8px">
          <Button
            variant="outline"
            colorScheme="green"
            onClick={viewCamperOnClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewCamperModal;
