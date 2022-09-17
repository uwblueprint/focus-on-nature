import { SearchIcon } from "@chakra-ui/icons";
import { FaEllipsisV } from "react-icons/fa";
import {
  Container,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { CampResponse } from "../../../types/CampsTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";

const CampsTable = (): JSX.Element => {
  enum CampStatusFilters {
    PUBLISHED = "Published",
    DRAFTS = "Drafts",
    COMPLETED = "Completed",
  }


  const filterOptions = [CampStatusFilters.PUBLISHED, CampStatusFilters.DRAFTS, CampStatusFilters.COMPLETED];

  const [camps, setCamps] = React.useState([] as CampResponse[]);
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<CampStatusFilters>(
    CampStatusFilters.PUBLISHED,
  );

  const toast = useToast();

  React.useEffect(() => {
    const getCamps = async () => {
      const res = await CampsAPIClient.getAllCamps();
      if (res.length !== undefined) setCamps(res);
    };

    getCamps();
  }, []);

  const tableData = React.useMemo(() => {
    let filteredCamps;
    if (selectedFilter === CampStatusFilters.PUBLISHED) filteredCamps = camps.filter((camp) => camp.active);
    else if (selectedFilter === CampStatusFilters.DRAFTS)
      filteredCamps = camps.filter((camp) => camp.active);
    else filteredCamps = camps.filter((camp) => !camp.active);

    if (!search) return filteredCamps;
    return filteredCamps.filter(
      (camp) =>
      camp.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, selectedFilter, camps]);


  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      px="3em"
      py="3em"
      background="background.grey.200"
    >
      <Container
        py="20px"
        maxWidth="100vw"
        background="background.grey.300"
        borderTopRadius="lg"
      >
        <HStack spacing={12}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              size="md"
              enterKeyHint="enter"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by camp name"
            />
          </InputGroup>
          <HStack spacing={3}>
            {filterOptions.map((option) => {
              return (
                <Tag
                  key={option}
                  size="md"
                  borderRadius="full"
                  variant={selectedFilter === option ? "solid" : "outline"}
                  colorScheme={selectedFilter === option ? "green" : "gray"}
                  px="1em"
                  onClick={() => setSelectedFilter(option)}
                >
                  <TagLabel>{option}</TagLabel>
                </Tag>
              );
            })}
          </HStack>
        </HStack>
      </Container>
      <Table
        background="background.white.100"
        variant="simple"
        colorScheme="blackAlpha"
        style={{ borderCollapse: "separate" }}
      >
        <Thead>
          <Tr>
            <Th color="text.default.100">Camp Name</Th>
            <Th color="text.default.100">Camp Dates</Th>
            <Th color="text.default.100">Camp Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((camp, key) => (
            <Tr key={key}>
              <Td>{`${camp.name}`}</Td>
              <Td>{camp.startTime}</Td>
              <Td>asdfghj</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default CampsTable;
