import { SearchIcon } from "@chakra-ui/icons";
import { FaEllipsisV } from "react-icons/fa";
import {
  Button,
  Container,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { CampResponse, CampStatus } from "../../../types/CampsTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import {
  campStatus,
  getFormattedCampDateRange,
  locationString,
} from "../../../utils/CampUtils";
import CampStatusLabel from "./CampStatusLabel";

interface CampsTableProps {
  year: number;
}

const CampsTable = (props: CampsTableProps): JSX.Element => {
  const { year } = props;

  const filterOptions = [
    CampStatus.PUBLISHED,
    CampStatus.DRAFT,
    CampStatus.COMPLETED,
  ];

  const [yearState, setYearState] = React.useState(year);
  const [camps, setCamps] = React.useState([] as CampResponse[]);
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<CampStatus | "">(
    "",
  );
  const [campToEdit, setCampToEdit] = React.useState<CampResponse | null>(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    const getCamps = async () => {
      const res = await CampsAPIClient.getAllCamps(year);
      if (res.length) setCamps(res);
    };

    getCamps();
  }, []);

  React.useEffect(() => {
    setYearState(year);
  }, [year]);

  const tableData = React.useMemo(() => {
    let filteredCamps = camps;
    if (selectedFilter === CampStatus.PUBLISHED)
      filteredCamps = camps.filter(
        (camp) => campStatus(camp) === CampStatus.PUBLISHED,
      );
    else if (selectedFilter === CampStatus.DRAFT)
      filteredCamps = camps.filter(
        (camp) => campStatus(camp) === CampStatus.DRAFT,
      );
    else if (selectedFilter === CampStatus.COMPLETED)
      filteredCamps = camps.filter(
        (camp) => campStatus(camp) === CampStatus.COMPLETED,
      );
    if (!search) return filteredCamps;
    return filteredCamps.filter(
      (camp) =>
        camp.name && camp.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, selectedFilter, camps]);

  const handleFilterSelect = (selectedOption: CampStatus) => {
    // handle unselecting the current selected filter
    if (selectedFilter === selectedOption) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(selectedOption);
    }
  };

  const handleStatusChangePopoverTrigger = (camp: CampResponse) => {
    setCampToEdit(camp);
    onOpen();
  };

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
                  onClick={() => handleFilterSelect(option)}
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
            <Th color="text.default.100"> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((camp, key) => (
            <Tr key={key}>
              <Td>
                <Text textStyle="bodyBold">{camp.name}</Text>
                <Text textStyle="bodyRegular">
                  {locationString(camp.location)}
                </Text>
              </Td>
              <Td>
                {camp.campSessions.length > 0
                  ? getFormattedCampDateRange(
                      camp.campSessions[0].dates,
                      camp.campSessions[camp.campSessions.length - 1].dates,
                    )
                  : ""}
              </Td>
              <Td>
                <CampStatusLabel status={campStatus(camp)} />
              </Td>
              <Td>
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <IconButton
                      aria-label="More options button"
                      icon={<FaEllipsisV />}
                      variant=""
                    />
                  </PopoverTrigger>
                  <PopoverContent width="inherit">
                    <PopoverBody
                      as={Button}
                      bg="background.white.100"
                      onClick={(e) => handleStatusChangePopoverTrigger(camp)}
                    >
                      <Text textStyle="buttonRegular">Placeholder text</Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default CampsTable;
