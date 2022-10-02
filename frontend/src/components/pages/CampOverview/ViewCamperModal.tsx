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

import { Camper } from "../../../types/CamperTypes";
import { CamperDetailsBadgeGroup } from "./CampersTable/CamperDetailsBadge";
import PickupDropoffTableRow from "./PickupDropoffTableRow";

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
  const map1: Map<string, string> = new Map();

  map1.set("Any other details?", "No");
  map1.set("Favourite color", "Purple");
  map1.set("What is 2 + 2", "Four");

  return (
    <Modal
      isOpen={viewCamperModalIsOpen}
      onClose={viewCamperOnClose}
      isCentered
    >
      {console.log(camper)}
      <ModalOverlay />
      <ModalContent maxWidth="600px" maxHeight="75%">
        <TableContainer ml={8} pr={8} overflowY="auto">
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td pl={0} pr={0} pt={8} borderBottom="2px">
                  <Text textStyle="displayLarge">
                    {camper.firstName} {camper.lastName}{" "}
                    <Text as="span" fontWeight="400">
                      {" "}
                      | Age: {camper.age}
                    </Text>
                  </Text>
                  <Text textStyle="displaySmallRegular" pb={2}>
                    Amount Paid: $
                    {Object.values(camper.charges).reduce((a, b) => a + b)}
                  </Text>
                  <CamperDetailsBadgeGroup camper={camper} paddingLeft="0px" />
                </Td>
              </Tr>

              <Tr>
                <Td pl={0} pr={8} borderBottom="2px">
                  <Text textStyle="displaySmallBold" pb={2}>
                    Earliest Drop-off and Latest Pick-up
                  </Text>

                  <TableContainer>
                    <Table variant="unstyled">
                      <Tbody>
                        <PickupDropoffTableRow
                          date={1}
                          earlyDropoff={camper.earlyDropoff}
                          latePickup={camper.latePickup}
                        />
                        <PickupDropoffTableRow
                          date={2}
                          earlyDropoff={camper.earlyDropoff}
                          latePickup={camper.latePickup}
                        />
                        <PickupDropoffTableRow
                          date={3}
                          earlyDropoff={camper.earlyDropoff}
                          latePickup={camper.latePickup}
                        />
                        <PickupDropoffTableRow
                          date={4}
                          earlyDropoff={camper.earlyDropoff}
                          latePickup={camper.latePickup}
                        />
                        <PickupDropoffTableRow
                          date={5}
                          earlyDropoff={camper.earlyDropoff}
                          latePickup={camper.latePickup}
                        />
                      </Tbody>
                    </Table>
                  </TableContainer>
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
                    borderColor="#C4C4C4"
                    color="black"
                    placeholder={
                      camper.allergies
                        ? camper.allergies
                        : "No allergies specified."
                    }
                    _placeholder={{ color: "black" }}
                  />
                  <Text textStyle="bodyBold" pt={4} pb={2}>
                    Please indicate if your child requires additional needs or
                    assistance
                  </Text>
                  <Textarea
                    isDisabled
                    textStyle="bodyRegular"
                    size="sm"
                    resize="none"
                    borderColor="#C4C4C4"
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

                  {/* Need to review how formResponses is implemented with the Camper DTO, this is just a mock map */}
                  {Array.from(map1).map((response, i) => {
                    return (
                      <Box as="span" key={i}>
                        <Text textStyle="bodyBold" pt={4}>
                          {response[0]}
                        </Text>
                        <Text textStyle="bodyRegular">{response[1]}</Text>
                      </Box>
                    );
                  })}

                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <ModalFooter bg="#FAFAFA" borderRadius="8px">
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
