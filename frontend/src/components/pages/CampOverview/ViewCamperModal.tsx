import React from "react";

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { Camper } from "../../../types/CamperTypes";
import { CamperDetailsBadgeGroup } from "./CampersTable/CamperDetailsBadge";
import { ReactComponent as SunriseIcon } from "../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../assets/icon_sunset.svg";

type ViewCamperModalProps = {
  viewCamperModalIsOpen: boolean;
  viewCamperOnClose: () => void;
  camper: Camper;
};


// findTime consumes an array of dates and a specified weekday (i.e. Sunday = 0, Monday = 1, etc.).
// Returns the time of the first date in the array that matches the weekday (i.e. 8:00 AM) or XX:XX if none found.
const findTime = (dates: Date[] | undefined, weekday: number) => {
  
  let finalTime = "XX:XX XX"
  
  if (dates) {
    dates.forEach(date => {
      const parsedDate = new Date(date)
      if (parsedDate.getDay() === weekday) {
        let hours = parsedDate.getHours()
        const afternoon = hours > 12
        hours %= 12
        finalTime = `${hours}:${parsedDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} ${afternoon ? "PM" : "AM"}`
      }
    })
  }

  return finalTime
}

const ViewCamperModal = ({
  viewCamperModalIsOpen,
  viewCamperOnClose,
  camper,
}: ViewCamperModalProps): JSX.Element => {
  return (
    <Modal isOpen={viewCamperModalIsOpen} onClose={viewCamperOnClose} size="xl">
      <ModalOverlay />
      <ModalContent>       
      <TableContainer ml={8} mr={8}>
        <Table variant='simple'>
          <Tbody>



            <Tr>
              <Td pl={0} pr={0}>
                <Text fontSize="24px" fontWeight="600" pt={5} pb={1}>{camper.firstName} {camper.lastName} <Text as="span" fontWeight="400" fontSize="24px"> | Age: {camper.age}</Text></Text> 
                <Text fontSize="18px" pt={1} pb={3}>Amount Paid: ${Object.values(camper.charges).reduce((a, b) => a + b)}</Text> 
                <CamperDetailsBadgeGroup camper={camper} paddingStart="0px"/>
              </Td>
            </Tr>



            <Tr>
              <Td pl={0} pr={16}>
                <Text fontSize="18px" fontWeight="700">Earliest Drop-off and Latest Pick-up</Text>


                <TableContainer>
                  <Table variant='unstyled'>
                    <Tbody>
                      <Tr>
                        <Td fontSize="14px" fontWeight="700" p={0}>Monday</Td>
                        <Td p={0}>
                          {findTime(camper.earlyDropoff, 1)}
                        </Td>
                        <Td p={0}>25.4</Td>
                      </Tr>
                      <Tr>
                        <Td fontSize="14px" fontWeight="700" p={0}>Tuesday</Td>
                        <Td p={0}>centimetres (cm)</Td>
                        <Td p={0}>30.48</Td>
                      </Tr>
                      <Tr>
                        <Td fontSize="14px" fontWeight="700" p={0}>Wednesday</Td>
                        <Td p={0}>metres (m)</Td>
                        <Td p={0}>0.91444</Td>
                      </Tr>
                      <Tr>
                        <Td fontSize="14px" fontWeight="700" p={0}>Thursday</Td>
                        <Td p={0}>metres (m)</Td>
                        <Td p={0}>0.91444</Td>
                      </Tr>
                      <Tr>
                        <Td fontSize="14px" fontWeight="700" p={0}>Friday</Td>
                        <Td p={0}>metres (m)</Td>
                        <Td p={0}>0.91444</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>




              </Td>
            </Tr>

            <Tr>
              <Td pl={0} pr={16}>
                  <Text fontSize="18px" fontWeight="700">Camper Information</Text>
                  <Text fontSize="14px" fontWeight="700">Allergies</Text>
                  <Text fontSize="14px" fontWeight="400">{camper.allergies}</Text>
                  <Text fontSize="14px" fontWeight="700">Please indicate if your child requires additional needs or assistance</Text>
                  <Text fontSize="14px" fontWeight="400">{camper.specialNeeds}</Text>



              </Td>
            </Tr>

            <Tr>
              <Td pl={0} pr={16} borderBottom="0">
                  <Text fontSize="18px" fontWeight="700">Camp Specific Questions</Text>
                  
                  {console.log(`length of the map: ${camper.formResponses?.size}`)}

                  {/* 622cfedaaf70bf090031d064 => "five" */}
                  {/* 622cfedaaf70bf090031d064 => "four" */}

                  {/* {camper.formResponses?.forEach((question, answer) => {
                    // <>
                    // <Text fontSize="14px" fontWeight="700">{question}</Text>
                    // <Text fontSize="14px" fontWeight="400">{answer}</Text>
                    // </>
                    console.log(question, answer)
                  })} */}

              </Td>
            </Tr>

          </Tbody>
        </Table>
      </TableContainer>
        {/* 
        
        <ModalCloseButton />
        
        <ModalBody>
        <Divider />

        <Text fontSize="18px" fontWeight="700">Earliest Drop-off and Latest Pick-up</Text>

        </ModalBody> */}

        <ModalFooter bg="#FAFAFA" borderRadius="8px">
          <Button variant="outline" colorScheme="green" onClick={viewCamperOnClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewCamperModal;
