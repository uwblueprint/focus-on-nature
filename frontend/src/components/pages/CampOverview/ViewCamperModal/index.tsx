import React from "react";

import {
  Box,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalFooter,
  Button,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
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
    >
      <ModalOverlay />
      <ModalContent maxWidth="600px" maxHeight="75%">
        <TableContainer ml={8} pr={8} overflowY="auto">
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td pl={0} pr={0} pt={8} borderBottom="2px">
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
                </Td>
              </Tr>

              <Tr>
                <Td pl={0} pr={8} borderBottom="2px">
                  <Text textStyle="displaySmallBold" pb={2}>
                    Earliest Drop-off and Latest Pick-up
                  </Text>
                  <PickupDropoffTable
                    earlyDropoff={camper.earlyDropoff}
                    latePickup={camper.latePickup}
                  />
                </Td>
              </Tr>

              <Tr>
                <Td pl={0} pr={0} borderBottom="2px">
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
                      camper.allergies
                        ? camper.allergies
                        : "No allergies specified."
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
                </Td>
              </Tr>

              <Tr>
                <Td pl={0} pr={0} borderBottom="0">
                  <Text textStyle="displaySmallBold">
                    Camp Specific Questions
                  </Text>
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
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
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