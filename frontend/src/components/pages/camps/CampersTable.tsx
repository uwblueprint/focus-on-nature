import React from "react";

import {
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  TableCaption,
  Text,
  Thead,
  Tbody,
  Tr,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon } from "@chakra-ui/icons";
import { Camper } from "../../../types/CamperTypes";

const CampersTableFilter = () => {
  return <>hey</>;
};

const ExportButton = () => {
  return (
    <button type="submit">
      <Flex
        flexDirection="row"
        alignItems="center"
        marginLeft="90px"
        border="1px"
        borderColor="primary.green.100"
        borderRadius="5px"
        padding="5px 8px"
      >
        <DownloadIcon color="primary.green.100" margin="0 5px" />
        <Text color="primary.green.100">Export as .csv</Text>
      </Flex>
    </button>
  );
};

export const CampersTable = ({ campers }: { campers: Camper[] }) => {
  const [displayedCampers, setDisplayedCampers] = React.useState<Camper[]>(
    campers,
  );

  return (
    <>
      <Flex
        width="100%"
        padding="24px 32px"
        whiteSpace="nowrap"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="background.grey.100"
        roundedTop="md"
      >
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Search by camper name..."
            size="md"
            marginRight="8px"
          />
        </InputGroup>
        <Box>
          <ExportButton />
        </Box>
      </Flex>

      <Table variant="simple" outline="1px solid --chakra-colors-gray-900">
        <Thead margin="16px 0">
          <Tr>
            <Td maxWidth="210px">Camper Name/Age</Td>
            <Td maxWidth="320px">Primary Emergency Contact</Td>
            <Td maxWidth="320px">Secondary Emergency Contact</Td>
            <Td maxWidth="790px">Camper Details</Td>
          </Tr>
        </Thead>
        <Tbody>
          {displayedCampers.map((camper, i) => (
            <Tr key={i} margin="16px 0">
              <Td>
                <VStack align="start">
                  <Text fontWeight="bold">{`${camper.firstName} ${camper.lastName}`}</Text>
                  <Text>Age:&nbsp;{5}</Text>
                </VStack>
              </Td>
              <Td>
                <VStack align="start">
                  <Text fontWeight="bold">{`${camper.firstName} ${camper.lastName}`}</Text>
                  <Text>Age:&nbsp;{5}</Text>
                </VStack>
              </Td>
              <Td>
                <VStack align="start">
                  <Text fontWeight="bold">{`${camper.firstName} ${camper.lastName}`}</Text>
                  <Text>Age:&nbsp;{5}</Text>
                </VStack>
              </Td>
              <Td>
                <VStack align="start">
                  <Text fontWeight="bold">{`${camper.firstName} ${camper.lastName}`}</Text>
                  <Text>Age:&nbsp;{5}</Text>
                </VStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex
        backgroundColor="background.grey.100"
        padding="16px 0"
        width="100%"
        justifyContent="flex-end"
        roundedBottom="lg"
      >
        Pagination thinasg
      </Flex>
    </>
  );
};

export default CampersTable;
