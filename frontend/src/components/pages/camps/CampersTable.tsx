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
  VStack,
  IconButton,
  HStack,
  Button,
  TagLabel,
  Tag,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon } from "@chakra-ui/icons";

import {
  faPerson,
  faHandDots,
  faHandshakeAngle,
} from "@fortawesome/free-solid-svg-icons";
import icon_sunrise from "../../../assets/icon_sunrise.svg";
import icon_sunset from "../../../assets/icon_sunset.svg";

import { CamperDetailsBadgeGroup } from "./CamperDetailsBadges";
import CampersTableFilterTag from "./CampersTableFilterTag";

import { Camper } from "../../../types/CamperTypes";
import textStyles from "../../../theme/textStyles";

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

const CampersTable = ({
  campers,
  campSessionCapacity,
}: {
  campers: Camper[];
  campSessionCapacity: number;
}) => {
  enum Filter {
    ALL = "All",
    EARLY_DROP_OFF = "Early Drop Off",
    LATE_PICK_UP = "Late Pick Up",
    HAS_ALLERGIES = "Has Allergies",
    ADDITIONAL_NEEDS = "Additional Needs",
  }

  const filterOptions = [
    Filter.ALL,
    Filter.EARLY_DROP_OFF,
    Filter.LATE_PICK_UP,
    Filter.HAS_ALLERGIES,
    Filter.ADDITIONAL_NEEDS,
  ];

  const [displayedCampers, setDisplayedCampers] = React.useState(campers);
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<Filter>(
    Filter.ALL,
  );

  const tableData = React.useMemo(() => {
    let filteredCampers;

    if (selectedFilter === Filter.EARLY_DROP_OFF)
      filteredCampers = campers.filter((camper) => camper.earlyDropoff);
    else if (selectedFilter === Filter.LATE_PICK_UP)
      filteredCampers = campers.filter((camper) => camper.latePickup);
    else if (selectedFilter === Filter.HAS_ALLERGIES)
      filteredCampers = campers.filter((camper) => camper.allergies);
    else if (selectedFilter === Filter.ADDITIONAL_NEEDS)
      filteredCampers = campers.filter((camper) => camper.specialNeeds);
    else filteredCampers = displayedCampers;

    if (!search) return filteredCampers;
    return filteredCampers.filter((camper: any) =>
      camper.firstName
        .toLowerCase()
        .concat(" ", camper.lastName.toLowerCase())
        .includes(search.toLowerCase()),
    );
  }, [search, selectedFilter, displayedCampers]);

  const [camperDetailsCount, setCamperDetailsCount] = React.useState({
    earlyDropoff: 0,
    latePickup: 0,
    allergies: 0,
    specialNeeds: 0,
  });

  React.useMemo(() => {
    const tempDetailsCount = {
      earlyDropoff: 0,
      latePickup: 0,
      allergies: 0,
      specialNeeds: 0,
    };

    campers.forEach((camper) => {
      if (camper.earlyDropoff) tempDetailsCount.earlyDropoff += 1;
      if (camper.latePickup) tempDetailsCount.latePickup += 1;
      if (camper.allergies) tempDetailsCount.allergies += 1;
      if (camper.specialNeeds) tempDetailsCount.specialNeeds += 1;
    });

    setCamperDetailsCount(tempDetailsCount);
  }, [campers]);

  return (
    <Container
      maxWidth="90vw"
      px="-5"
      py="5"
      background="background.grey.200"
      borderRadius="20"
    >
      {campers.length > 0 ? (
        <>
          <HStack spacing={3} px="18">
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

            {filterOptions.map((option) => {
              return (
                <Tag
                  key={option}
                  size="lg"
                  borderRadius="full"
                  minWidth="-webkit-fit-content"
                  margin="0px"
                  variant={selectedFilter === option ? "subtle" : "outline"}
                  colorScheme={selectedFilter === option ? "linkedin" : "gray"}
                  onClick={() => setSelectedFilter(option)}
                >
                  <TagLabel>
                    {option === Filter.ALL && (
                      <CampersTableFilterTag
                        customIcon={false}
                        icon={faPerson}
                        description={campers.length
                          .toString()
                          .toString()
                          .concat("/")
                          .concat(campSessionCapacity.toString())}
                        color={
                          campSessionCapacity === campers.length
                            ? "text.critical.100"
                            : "text.default.100"
                        }
                      />
                    )}
                    {option === Filter.EARLY_DROP_OFF && (
                      <CampersTableFilterTag
                        customIcon
                        icon={icon_sunset}
                        description={camperDetailsCount.earlyDropoff.toString()}
                        color="text.default.100"
                      />
                    )}
                    {option === Filter.LATE_PICK_UP && (
                      <CampersTableFilterTag
                        customIcon
                        icon={icon_sunrise}
                        description={camperDetailsCount.latePickup.toString()}
                        color="text.default.100"
                      />
                    )}
                    {option === Filter.HAS_ALLERGIES && (
                      <CampersTableFilterTag
                        customIcon={false}
                        icon={faHandDots}
                        description={camperDetailsCount.allergies.toString()}
                        color="text.default.100"
                      />
                    )}
                    {option === Filter.ADDITIONAL_NEEDS && (
                      <CampersTableFilterTag
                        customIcon={false}
                        icon={faHandshakeAngle}
                        description={camperDetailsCount.specialNeeds.toString()}
                        color="text.default.100"
                      />
                    )}
                  </TagLabel>
                </Tag>
              );
            })}
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
                    <CamperDetailsBadgeGroup camper={camper} />
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
            No camper registrations yet
          </Text>
          <Text>Check back later!</Text>
        </VStack>
      )}
    </Container>
  );
};

export default CampersTable;
