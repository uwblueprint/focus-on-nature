import { SearchIcon } from "@chakra-ui/icons";
import { FaEllipsisV } from "react-icons/fa";
import {
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tag,
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
import { faPerson, faEnvelopesBulk, faHourglassEnd, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import textStyles from "../../../theme/textStyles"; 

const WaitlistStatusCard = ({status}:any) => {
  let bkgColor = ""; 
  let statusText = "";
  let icon: IconProp | null = faEnvelopesBulk; 
  
  if (status === "RegistrationFormSent") {
    bkgColor = "waitlistCards.sent";
    statusText = "registration form sent";
    icon = faEnvelopesBulk;
  } else if (status === "Registered") {
    bkgColor = "waitlistCards.complete";
    statusText = "registration complete";
    icon = faUserCheck
  } else {
    bkgColor = "background.white" 
    icon = null; 
  }

  return (
    <Container background={bkgColor} px="2" py="2" borderRadius="5">
      <HStack>
        {icon && <FontAwesomeIcon icon={icon} />}
        <Text>{statusText}</Text>
      </HStack>
    </Container>
  )
}

const WaitlistedCampersTable = ({waitlistedCampers}: any): JSX.Element => {
  enum Filter {
    ALL = "All",
    ACTIVE = "Active",
    INACTIVE = "Inactive",
  }

  enum UserRoles {
    ADMIN = "FON Admin",
    CAMP_COORDINATOR = "Camp Coordinator",
  }

  const filterOptions = [Filter.ALL, Filter.ACTIVE, Filter.INACTIVE];

  const userRoles = [UserRoles.ADMIN, UserRoles.CAMP_COORDINATOR];

  const [campers, setCampers] = React.useState(waitlistedCampers); 
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<Filter>(
    Filter.ALL,
  );

  const waitlistData = React.useMemo(() => {
    // populate data here
  }, [search]); 

  const tableData = React.useMemo(() => {
    const filteredCampers = campers;
    // let filteredUsers = users; 

    // if (selectedFilter === Filter.ALL) filteredUsers = users;
    // else if (selectedFilter === Filter.ACTIVE)
    //   filteredUsers = users.filter((user) => user.active);
    // else filteredUsers = users.filter((user) => !user.active);

    // filtered campers = paginated campers 
    // ask about how pagination works - do we want to paginate even with search 

    if (!search) return filteredCampers;
    return campers.filter(
      (camper:any) =>
        camper.firstName
          .toLowerCase()
          .concat(" ", camper.lastName.toLowerCase())
          .includes(search.toLowerCase()),
    );
  }, [search, selectedFilter, campers]);

  return (
    <Container
      maxWidth="90vw"
      px="-5"
      py="5"
      background="background.grey.100"
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
        <HStack ps="500" pe="10" color="secondary.critical.100" textStyle="buttonSemiBold" >
          <FontAwesomeIcon icon={faPerson} />
          <Text>{waitlistedCampers.length}</Text>
        </HStack>
      </HStack>

      <Table
        background="background.white.100"
        colorScheme="blackAlpha"
        variant="striped"
        mt="20px"
      >
        <Thead>
          <Tr>
            <Th color="text.default.100">Camper Name and Age</Th>
            <Th color="text.default.100">Camper Contact Information</Th>
            <Th color="text.default.100"> </Th>
            <Th color="text.default.100"> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((camper:any, key:any) => (
            <Tr key={key}>
              <Td>
                <VStack align="start" >
                  <Text style={textStyles.buttonSemiBold} >{camper.firstName}&nbsp;{camper.lastName}</Text>
                  <Text>Age:&nbsp;{camper.age}</Text>
                </VStack>
                </Td>
              <Td>
                <VStack align="start" >
                  <Text style={textStyles.buttonSemiBold} >{camper.contactName}</Text>
                  <Text>{camper.contactNumber}&nbsp;|&nbsp;{camper.contactEmail}</Text>
                </VStack>
              </Td>
              <Td>
                <WaitlistStatusCard status={camper.status} />
              </Td>
              <Td>
                <IconButton
                  aria-label="Mark as active button"
                  icon={<FaEllipsisV />}
                  variant=""
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Text align="end" m="5" >Page Scroll Thing</Text>
    </Container>
  );
};

export default WaitlistedCampersTable;