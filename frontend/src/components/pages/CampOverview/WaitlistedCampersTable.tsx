import { SearchIcon } from "@chakra-ui/icons";
import { FaEllipsisV } from "react-icons/fa";
import {
  Container,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faEnvelopesBulk,
  faHourglassEnd,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import textStyles from "../../../theme/textStyles";

const WaitlistStatusCard = ({ status, linkExpiry }: any) => {
  let bkgColor = "";
  let statusText = "";
  let icon: IconProp | null = faEnvelopesBulk;
  let validStatus = true;
  let pastExpiration = false;
  const expirationDate = new Date(linkExpiry);

  if (status === "RegistrationFormSent") {
    bkgColor = "waitlistCards.sent";
    statusText = "registration form sent";
    icon = faEnvelopesBulk;
  } else if (status === "Registered") {
    bkgColor = "waitlistCards.complete";
    statusText = "registration complete";
    icon = faUserCheck;
  } else {
    validStatus = false;
  }

  if (linkExpiry && expirationDate.getTime() < Date.now())
    pastExpiration = true;

  return (
    <Container width="-webkit-fit-content" marginStart="0px">
      <HStack>
        {validStatus && (
          <HStack
            alignContent="center"
            background={bkgColor}
            px="5"
            py="2"
            borderRadius="5"
          >
            {icon && <FontAwesomeIcon icon={icon} />}
            <Text>{statusText}</Text>
          </HStack>
        )}
        {linkExpiry && pastExpiration && (
          <HStack
            alignContent="center"
            background="waitlistCards.expired"
            px="5"
            py="2"
            borderRadius="5"
          >
            <FontAwesomeIcon icon={faHourglassEnd} />
            <Text>registration expired</Text>
          </HStack>
        )}
      </HStack>
    </Container>
  );
};

const WaitlistedCampersTable = ({ waitlistedCampers }: any): JSX.Element => {
  const [campers, setCampers] = React.useState(waitlistedCampers);
  const [search, setSearch] = React.useState("");

  const tableData = React.useMemo(() => {
    const filteredCampers = campers;

    if (!search) return filteredCampers;
    return filteredCampers.filter((camper: any) =>
      camper.firstName
        .toLowerCase()
        .concat(" ", camper.lastName.toLowerCase())
        .includes(search.toLowerCase()),
    );
  }, [search, campers]);

  return (
    <Container
      maxWidth="90vw"
      px="-5"
      py="5"
      background="background.grey.200"
      borderRadius="20"
    >
      {waitlistedCampers ? (
        <>
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
            <HStack
              ps="10vw"
              pe="1.5vw"
              color="secondary.critical.100"
              textStyle="buttonSemiBold"
            >
              <FontAwesomeIcon icon={faPerson} />
              <Text>{waitlistedCampers.length}</Text>
            </HStack>
          </HStack>

          <Table
            background="background.white.100"
            colorScheme="blackAlpha"
            variant="simple"
            pl="5px"
            mt="20px"
            mb="20px"
          >
            <Thead>
              <Tr>
                <Th color="text.default.100">Camper Name and Age</Th>
                <Th color="text.default.100">Camper Contact Information</Th>
                <Th color="text.default.100">&nbsp;</Th>
                <Th color="text.default.100">&nbsp;</Th>
                <Th color="text.default.100">&nbsp;</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((camper: any, key: any) => (
                <Tr key={key}>
                  <Td>
                    <VStack align="start">
                      <Text style={textStyles.buttonSemiBold}>
                        {camper.firstName}&nbsp;{camper.lastName}
                      </Text>
                      <Text>Age:&nbsp;{camper.age}</Text>
                    </VStack>
                  </Td>
                  <Td paddingRight="0px">
                    <VStack align="start">
                      <Text style={textStyles.buttonSemiBold}>
                        {camper.contactName}
                      </Text>
                      <Text>
                        {camper.contactNumber}&nbsp;|&nbsp;{camper.contactEmail}
                      </Text>
                    </VStack>
                  </Td>
                  <Td paddingLeft="0px">
                    <WaitlistStatusCard
                      status={camper.status}
                      linkExpiry={camper.linkExpiry}
                    />
                  </Td>
                  <Td width="10vw">
                    <Text>&nbsp;</Text>
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
        </>
      ) : (
        <VStack pb="18px" pt="18px">
          <Text style={textStyles.buttonSemiBold}>
            No campers on the waitlist yet
          </Text>
          <Text>Check back later!</Text>
        </VStack>
      )}
    </Container>
  );
};

export default WaitlistedCampersTable;
