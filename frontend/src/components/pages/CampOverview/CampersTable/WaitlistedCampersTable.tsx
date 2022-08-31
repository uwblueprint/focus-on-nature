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
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import textStyles from "../../../../theme/textStyles";
import { WaitlistedCamper } from "../../../../types/WaitlistedCamperTypes";

import { WaitlistDetailsBadgeGroup } from "./CamperDetailsBadge";

const WaitlistedCampersTable = ({
  waitlistedCampers,
}: {
  waitlistedCampers: WaitlistedCamper[];
}): JSX.Element => {
  const [campers, setCampers] = React.useState(waitlistedCampers);
  const [search, setSearch] = React.useState("");

  const tableData = React.useMemo(() => {
    const filteredCampers = campers;

    if (!search) return filteredCampers;
    return filteredCampers.filter((camper: WaitlistedCamper) =>
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
      {waitlistedCampers.length > 0 ? (
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
            <Thead margin="16px 0">
              <Tr>
                <Td>Camper</Td>
                <Td>Camper Contact Information</Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((camper, i) => (
                <Tr key={i} margin="16px 0">
                  <Td maxWidth="210px">
                    <VStack align="start">
                      <Text style={textStyles.buttonSemiBold}>
                        {camper.firstName}&nbsp;{camper.lastName}
                      </Text>
                      <Text>Age:&nbsp;{camper.age}</Text>
                    </VStack>
                  </Td>
                  <Td paddingRight="0px" maxWidth="320px">
                    <VStack align="start">
                      <Text style={textStyles.buttonSemiBold}>
                        {camper.contactName}
                      </Text>
                      <Text>
                        {camper.contactNumber}&nbsp;|&nbsp;{camper.contactEmail}
                      </Text>
                    </VStack>
                  </Td>
                  <Td paddingLeft="0px" maxWidth="790px">
                    <WaitlistDetailsBadgeGroup
                      status={camper.status}
                      linkExpiry={camper.linkExpiry}
                    />
                  </Td>
                  <Td minWidth="20vw">
                    <Text>&nbsp;</Text>
                  </Td>
                  <Td
                    justifyContent="flex-end"
                    margin="0px"
                    padding="0px"
                    maxWidth="32px"
                  >
                    <IconButton
                      aria-label="Mark as active button"
                      icon={<FaEllipsisV />}
                      variant=""
                      // onClick={() => console.log("3 dot button pressed!")}
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
