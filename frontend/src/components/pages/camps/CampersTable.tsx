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
  Image,
  Input,
  InputGroup,
  InputLeftElement,
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
} from "@fortawesome/free-solid-svg-icons";

import icon_pickup from "../../../assets/icon_custom_sunrise.svg";
import icon_sunrise from "../../../assets/icon_sunrise.svg";
import icon_sunset from "../../../assets/icon_sunset.svg";

import textStyles from "../../../theme/textStyles";

import { Camper } from "../../../types/CamperTypes";

const ExportButton = () => {
  return (
    <Button
      leftIcon={<DownloadIcon />}
      aria-label="Export SVG"
      type="submit"
      background="background.grey.200"
      color="primary.green.100"
      border="2px"
      borderColor="primary.green.100"
      borderRadius="5px"
      minWidth="10vw"
    >
      Export as .csv
    </Button>
  );
};

const TableOverviewIcons = ({
  campers,
  campCapacity,
  camperDetailsCount,
}: {
  campers: Camper[];
  campCapacity: number;
  camperDetailsCount: { [key: string]: number };
}) => {
  return (
    <HStack>
      <HStack
        alignContent="center"
        background="background.white.100"
        border="1px"
        borderColor="background.grey.400"
        px="3"
        py="1"
        borderRadius="20"
        color="text.critical.100"
      >
        <FontAwesomeIcon icon={faPerson} />
        <Text fontWeight="bold">
          {campers.length}/{campCapacity}
        </Text>
      </HStack>
      {camperDetailsCount.earlyDropoff && (
        <HStack
          alignContent="center"
          background="background.white.100"
          border="1px"
          borderColor="background.grey.400"
          px="3"
          py="1"
          borderRadius="20"
        >
          <Image
            src={icon_sunset}
            alt="dropoff icon"
            display="inline"
            maxWidth="22px"
          />
          <Text fontWeight="bold">{camperDetailsCount.earlyDropoff}</Text>
        </HStack>
      )}
      {camperDetailsCount.latePickup && (
        <HStack
          alignContent="center"
          background="background.white.100"
          border="1px"
          borderColor="background.grey.400"
          px="3"
          py="1"
          borderRadius="20"
        >
          <Image
            src={icon_sunrise}
            alt="pickup icon"
            display="inline"
            maxWidth="22px"
          />
          <Text fontWeight="bold">{camperDetailsCount.latePickup}</Text>
        </HStack>
      )}
      {camperDetailsCount.allergies && (
        <HStack
          alignContent="center"
          background="background.white.100"
          border="1px"
          borderColor="background.grey.400"
          px="3"
          py="1"
          borderRadius="20"
        >
          <FontAwesomeIcon icon={faHandDots} />
          <Text fontWeight="bold">{camperDetailsCount.allergies}</Text>
        </HStack>
      )}
      {camperDetailsCount.specialNeeds && (
        <HStack
          alignContent="center"
          background="background.white.100"
          border="1px"
          borderColor="background.grey.400"
          px="3"
          py="1"
          borderRadius="20"
        >
          <FontAwesomeIcon icon={faHandshakeAngle} />
          <Text fontWeight="bold">{camperDetailsCount.specialNeeds}</Text>
        </HStack>
      )}
    </HStack>
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
            <Image
              src={icon_pickup}
              alt="pickup icon"
              display="inline"
              maxWidth="22px"
            />
            <Text>pick-up & drop-off</Text>
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

const CampersTable = ({
  campers,
  campCapacity,
}: {
  campers: Camper[];
  campCapacity: number;
}) => {
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

  const camperDetailsCount: { [key: string]: number } = {};
  campers.forEach((camper) => {
    if (camper.earlyDropoff) {
      if (camperDetailsCount.earlyDropoff) camperDetailsCount.earlyDropoff += 1;
      else camperDetailsCount.earlyDropoff = 1;
    }
    if (camper.latePickup) {
      if (camperDetailsCount.latePickup) camperDetailsCount.latePickup += 1;
      else camperDetailsCount.latePickup = 1;
    }
    if (camper.allergies) {
      if (camperDetailsCount.allergies) camperDetailsCount.allergies += 1;
      else camperDetailsCount.allergies = 1;
    }
    if (camper.specialNeeds) {
      if (camperDetailsCount.specialNeeds) camperDetailsCount.specialNeeds += 1;
      else camperDetailsCount.specialNeeds = 1;
    }
  });

  console.log(camperDetailsCount);

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
        <TableOverviewIcons
          campers={campers}
          campCapacity={campCapacity}
          camperDetailsCount={camperDetailsCount}
        />
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
