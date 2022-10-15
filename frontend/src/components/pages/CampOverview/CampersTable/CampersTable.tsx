import React from "react";

import {
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
  HStack,
  Button,
  TagLabel,
  Tag,
  Box,
  useDisclosure,
  AlertProps,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon } from "@chakra-ui/icons";

import { CamperDetailsBadgeGroup } from "./CamperDetailsBadge";
import CampersTableFilterTag from "./CampersTableFilterTag";

import { Camper } from "../../../../types/CamperTypes";
import { Filter, filterOptions } from "./CampersTableFilterTypes";

import textStyles from "../../../../theme/textStyles";
import CampersTableKebabMenu from "./CampersTableKebabMenu";
import EditCamperModal from "../EditCamperModal";
import MoveCamperModal from "../MoveCampersModal";
import { CampSession } from "../../../../types/CampsTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import Alert from "../../../common/Alert";

const ExportButton = (): JSX.Element => {
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
      minWidth="-webkit-fit-content"
      fontSize={textStyles.bodyRegular.fontSize}
    >
      Export as .csv
    </Button>
  );
};

const CampersTable = ({
  currentCampSession,
  campers,
  campSession,
  campSessionCapacity,
  updateCamp,
}: {
  currentCampSession: number;
  campers: Camper[];
  campSession: CampSession;
  campSessionCapacity: number;
  updateCamp: () => void;
}): JSX.Element => {
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<Filter>(
    Filter.ALL,
  );

  const {
    isOpen: moveModalIsOpen,
    onOpen: moveModalOnOpen,
    onClose: moveModalOnClose,
  } = useDisclosure();

  const {
    isOpen: editModalIsOpen,
    onOpen: editModalOnOpen,
    onClose: editModalOnClose,
  } = useDisclosure();

  const [alertInfo, setAlertInfo] = React.useState<{
    status: AlertProps["status"];
    description: string;
  } | null>(null);

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
    else filteredCampers = campers;

    if (!search) return filteredCampers;
    return filteredCampers.filter((camper: Camper) =>
      camper.firstName
        .toLowerCase()
        .concat(" ", camper.lastName.toLowerCase())
        .includes(search.toLowerCase()),
    );
  }, [search, selectedFilter, campers]);

  const [camperDetailsCount, setCamperDetailsCount] = React.useState({
    earlyDropoff: 0,
    latePickup: 0,
    allergies: 0,
    specialNeeds: 0,
  });

  const [selectedCamper, setSelectedCamper] = React.useState<
    Camper | undefined
  >();

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

  // Function to be called by the Move Campers Modal to update the campers
  const moveCampers = (camperIds: string[], campSessionId: string) => {
    CamperAPIClient.moveCampersToCampSession(camperIds, campSessionId).then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => {
        if (Object.keys(response).includes("isAxiosError")) {
          setAlertInfo({
            status: "error",
            description: response.response.data.error,
          });
        } else {
          setAlertInfo({
            status: "success",
            description: `${(response as Camper[])
              .slice(0, -1)
              .map((camper) => `${camper.firstName} ${camper.lastName}`)
              .join(", ")}${response.length !== 1 ? " and " : ""}${
              response[response.length - 1].firstName
            } ${response[response.length - 1].lastName} ${
              response.length !== 1 ? "have" : "has"
            } been moved to Session ${currentCampSession + 1}.`,
          });
          updateCamp();
        }
      },
    );
  };

  return (
    <Box px="-5" py="5" background="background.grey.100" borderRadius="20">
      {campers.length > 0 ? (
        <>
          <HStack spacing={1} px="18">
            <InputGroup marginRight="40px">
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
                  size="md"
                  borderRadius="full"
                  minWidth="-webkit-fit-content"
                  margin="0px"
                  variant={selectedFilter === option ? "solid" : "outline"}
                  colorScheme={selectedFilter === option ? "green" : "gray"}
                  onClick={() => setSelectedFilter(option)}
                >
                  <TagLabel textStyle="xSmallRegular">
                    <CampersTableFilterTag
                      filterOption={option}
                      selectedFilter={selectedFilter}
                      campers={campers}
                      campSessionCapacity={campSessionCapacity}
                      camperDetailsCount={camperDetailsCount}
                    />
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
            textStyle="bodyRegular"
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
                  <Td maxWidth="190px">
                    <VStack align="start">
                      <Text
                        style={textStyles.buttonSemiBold}
                      >{`${camper.firstName} ${camper.lastName}`}</Text>
                      <Text>Age:&nbsp;{camper.age}</Text>
                    </VStack>
                  </Td>
                  <Td maxWidth="320px">
                    <VStack align="start">
                      <Text
                        style={textStyles.buttonSemiBold}
                      >{`${camper.contacts[0].firstName} ${camper.contacts[0].lastName}`}</Text>
                      <Text>
                        {camper.contacts[0].phoneNumber} |{" "}
                        {camper.contacts[0].email}
                      </Text>
                    </VStack>
                  </Td>
                  <Td maxWidth="320px">
                    <VStack align="start">
                      <Text
                        style={textStyles.buttonSemiBold}
                      >{`${camper.contacts[1].firstName} ${camper.contacts[1].lastName}`}</Text>
                      <Text>
                        {camper.contacts[1].phoneNumber} |{" "}
                        {camper.contacts[1].email}
                      </Text>
                    </VStack>
                  </Td>
                  <Td pl="7px" maxWidth="760px">
                    <CamperDetailsBadgeGroup camper={camper} />
                  </Td>
                  <Td
                    justifyContent="flex-end"
                    margin="0px"
                    padding="0px"
                    maxWidth="32px"
                  >
                    <CampersTableKebabMenu
                      editCamperFunc={() => {
                        setSelectedCamper(camper);
                        editModalOnOpen();
                      }}
                      viewDetailsFunc={() => {
                        console.log("Viewing Camper");
                      }}
                      moveCamperFunc={() => {
                        setSelectedCamper(camper);
                        moveModalOnOpen();
                      }}
                      removeCamperFunc={() => {
                        console.log("Removing Camper");
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Add the registered camper action modals here  */}
          {selectedCamper && (
            <>
              <MoveCamperModal
                camper={selectedCamper}
                campSession={campSession}
                moveCampers={moveCampers}
                moveCamperModalIsOpen={moveModalIsOpen}
                moveCamperModalOnClose={moveModalOnClose}
              />
              <EditCamperModal
                camper={selectedCamper}
                editCamperModalIsOpen={editModalIsOpen}
                editCamperOnClose={editModalOnClose}
              />
            </>
          )}
        </>
      ) : (
        <VStack pb="18px" pt="18px">
          <Text style={textStyles.buttonSemiBold}>
            No camper registrations yet
          </Text>
          <Text>Check back later!</Text>
        </VStack>
      )}
      {alertInfo ? (
        <Alert status={alertInfo.status} description={alertInfo.description} />
      ) : null}
    </Box>
  );
};

export default CampersTable;
