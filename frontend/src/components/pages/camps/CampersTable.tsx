import React from "react";
import { FaEllipsisV } from "react-icons/fa";

import {
  Container,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  VStack,
  IconButton,
  HStack,
  Button,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon } from "@chakra-ui/icons";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faEnvelopesBulk,
  faHandDots,
  faHandshakeAngle,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import textStyles from "../../../theme/textStyles";

import { Camper } from "../../../types/CamperTypes";

const ExportButton = () => {
  return (
    <Button type="submit" background="background.grey.200">
      <Flex
        flexDirection="row"
        alignItems="center"
        border="1px"
        borderColor="primary.green.100"
        borderRadius="5px"
        padding="5px 8px"
      >
        <DownloadIcon color="primary.green.100" margin="0 5px" />
        <Text color="primary.green.100">Export as .csv</Text>
      </Flex>
    </Button>
  );
};

const CamperDetailsCard = ({ camper }: { camper: Camper }) => {
  const icon: IconProp | null = faEnvelopesBulk;

  return (
    <Container width="-webkit-fit-content" marginStart="0px">
      <HStack>
        {camper.latePickup && camper.earlyDropoff && (
          <HStack
            alignContent="center"
            background="camperDetailsCards.pickup"
            px="5"
            py="2"
            borderRadius="5"
          >
            <FontAwesomeIcon icon={faSun} />
            <Text>pick-up and drop-off</Text>
          </HStack>
        )}
        {camper.allergies && (
          <HStack
            alignContent="center"
            background="camperDetailsCards.hasAllergy"
            px="5"
            py="2"
            borderRadius="5"
          >
            {icon && <FontAwesomeIcon icon={faHandDots} />}
            <Text>has allergy</Text>
          </HStack>
        )}
        {camper.specialNeeds && (
          <HStack
            alignContent="center"
            background="camperDetailsCards.additionalNeeds"
            px="5"
            py="2"
            borderRadius="5"
          >
            {icon && <FontAwesomeIcon icon={faHandshakeAngle} />}
            <Text>additional needs</Text>
          </HStack>
        )}
      </HStack>
    </Container>
  );
};

export const CampersTable = ({ campers }: { campers: Camper[] }) => {
  const [displayedCampers, setDisplayedCampers] = React.useState(campers);
  const [search, setSearch] = React.useState("");

  const tableData = React.useMemo(() => {
    const filteredCampers = displayedCampers;

    if (!search) return filteredCampers;
    return filteredCampers.filter((camper: any) =>
      camper.firstName
        .toLowerCase()
        .concat(" ", camper.lastName.toLowerCase())
        .includes(search.toLowerCase()),
    );
  }, [search, displayedCampers]);

  return (
    <Container
      maxWidth="90vw"
      px="-5"
      py="5"
      background="background.grey.200"
      borderRadius="20"
    >
      <HStack spacing={12} px="18">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            size="md"
            enterKeyHint="enter"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by camper name..."
          />
        </InputGroup>
        <ExportButton />
      </HStack>

      <Table
        background="background.white.100"
        colorScheme="blackAlpha"
        variant="simple"
        pl="5px"
        mt="20px"
        mb="20px"
      >
        <Thead margin="16px 0">
          <Tr>
            <Td>Camper</Td>
            <Td>Primary Emergency Contact</Td>
            <Td>Secondary Emergency Contact</Td>
            <Td>Camper Details</Td>
            <Td>&nbsp;</Td>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((camper, i) => (
            <Tr key={i} margin="16px 0">
              <Td>
                <VStack align="start">
                  <Text fontWeight="bold">{`${camper.firstName} ${camper.lastName}`}</Text>
                  <Text>Age:&nbsp;{camper.age}</Text>
                </VStack>
              </Td>
              <Td>
                <VStack align="start">
                  <Text fontWeight="bold">{`${camper.contacts[0].firstName} ${camper.contacts[0].lastName}`}</Text>
                  <Text>
                    {camper.contacts[0].phoneNumber} |{" "}
                    {camper.contacts[0].email}
                  </Text>
                </VStack>
              </Td>
              <Td>
                <VStack align="start">
                  <Text fontWeight="bold">{`${camper.contacts[1].firstName} ${camper.contacts[1].lastName}`}</Text>
                  <Text>
                    {camper.contacts[1].phoneNumber} |{" "}
                    {camper.contacts[1].email}
                  </Text>
                </VStack>
              </Td>
              <Td pl="7px">
                <CamperDetailsCard camper={camper} />
              </Td>
              <Td justifyContent="flex-end" margin="0px" padding="0px">
                <IconButton
                  aria-label="Mark as active button"
                  icon={<FaEllipsisV />}
                  variant=""
                  onClick={() => console.log("3 dot button pressed!")}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default CampersTable;
