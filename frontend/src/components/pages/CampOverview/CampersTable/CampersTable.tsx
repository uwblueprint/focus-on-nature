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
  useToast,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon } from "@chakra-ui/icons";

import { CamperDetailsBadgeGroup } from "./CamperDetailsBadge";
import CampersTableFilterTag from "./CampersTableFilterTag";

import { Camper } from "../../../../types/CamperTypes";
import { CampSession, FormQuestion } from "../../../../types/CampsTypes";
import { Filter, filterOptions } from "./CampersTableFilterTypes";

import textStyles from "../../../../theme/textStyles";
import CampersTableKebabMenu from "./CampersTableKebabMenu";

import EditCamperModal from "../EditCamperModal";
import MoveCamperModal from "../MoveCamperModal";
import ViewCamperModal from "../ViewCamperModal";
import RemoveCamperModal from "../RemoveCamperModal/index";

import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import CampsAPIClient from "../../../../APIClients/CampsAPIClient";

const ExportButton = ({
  generateCsv,
}: {
  generateCsv: () => void;
}): JSX.Element => {
  return (
    <Box>
      <Button
        ml="30px"
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
        onClick={generateCsv}
      >
        Export as .csv
      </Button>
    </Box>
  );
};

const CampersTable = ({
  campers,
  campSession,
  campSessionCapacity,
  formQuestions,
  handleRefetch,
  generateCsv,
}: {
  campers: Camper[];
  campSession: CampSession;
  campSessionCapacity: number;
  formQuestions: FormQuestion[];
  handleRefetch: () => void;
  generateCsv: () => void;
}): JSX.Element => {
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<Filter>(
    Filter.ALL,
  );
  const [campSessions, setCampSessions] = React.useState<CampSession[]>([]);
  const [selectedCampSession, setSelectedCampSession] = React.useState<string>(
    campSession.id,
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

  const {
    isOpen: viewModalIsOpen,
    onOpen: viewModalOnOpen,
    onClose: viewModalOnClose,
  } = useDisclosure();

  const {
    isOpen: removeModalIsOpen,
    onOpen: removeModalOnOpen,
    onClose: removeModalOnClose,
  } = useDisclosure();

  const toast = useToast();

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

  React.useEffect(() => {
    CampsAPIClient.getCampById(campSession.camp).then((camp) => {
      setCampSessions(camp.campSessions);
    });
  }, [campSession.camp]);

  // Function to be called by the Move Campers Modal to update the campers
  const moveCampers = async (camperIds: string[], campSessionId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await CamperAPIClient.moveCampersToCampSession(
      camperIds,
      campSessionId,
    );

    if (Object.keys(res).includes("isAxiosError")) {
      toast({
        position: "bottom",
        title: res.response.data.error ?? res.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        position: "bottom",
        title: `${(res as Camper[])
          .slice(0, -1)
          .map((camper) => `${camper.firstName} ${camper.lastName}`)
          .join(", ")}${res.length !== 1 ? " and " : ""}${
          res[res.length - 1].firstName
        } ${res[res.length - 1].lastName} ${
          res.length !== 1 ? "have" : "has"
        } been moved to Session ${
          campSessions
            .map((campSessionItem) => campSessionItem.id)
            .indexOf(selectedCampSession) + 1
        }.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleRefetch();
    }
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
            <ExportButton generateCsv={generateCsv} />
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
                        setSelectedCamper(camper);
                        viewModalOnOpen();
                      }}
                      moveCamperFunc={() => {
                        setSelectedCamper(camper);
                        moveModalOnOpen();
                      }}
                      removeCamperFunc={() => {
                        setSelectedCamper(camper);
                        removeModalOnOpen();
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {selectedCamper && (
            <EditCamperModal
              camper={selectedCamper}
              formQuestions={formQuestions}
              editCamperModalIsOpen={editModalIsOpen}
              editCamperModalOnClose={editModalOnClose}
              handleRefetch={handleRefetch}
            />
          )}

          {selectedCamper && (
            <MoveCamperModal
              camper={selectedCamper}
              campSession={campSession}
              campSessions={campSessions}
              selectedCampSession={selectedCampSession}
              setSelectedCampSession={setSelectedCampSession}
              moveCampers={moveCampers}
              moveCamperModalIsOpen={moveModalIsOpen}
              moveCamperModalOnClose={moveModalOnClose}
            />
          )}

          {selectedCamper && (
            <ViewCamperModal
              camper={selectedCamper}
              viewCamperModalIsOpen={viewModalIsOpen}
              viewCamperOnClose={viewModalOnClose}
            />
          )}

          {selectedCamper && (
            <RemoveCamperModal
              camper={selectedCamper}
              removeModalIsOpen={removeModalIsOpen}
              removeModalOnClose={removeModalOnClose}
              handleRefetch={handleRefetch}
            />
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
    </Box>
  );
};

export default CampersTable;
