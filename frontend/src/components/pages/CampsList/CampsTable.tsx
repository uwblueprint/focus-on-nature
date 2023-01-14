import React, { Dispatch, SetStateAction } from "react";

import { useHistory } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import { FaEllipsisV } from "react-icons/fa";
import {
  Button,
  Center,
  Container,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Spinner,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { CampResponse, CampStatus } from "../../../types/CampsTypes";
import {
  compareCampDates,
  getCampStatus,
  getFormattedCampDateRange,
  locationString,
} from "../../../utils/CampUtils";
import CampStatusLabel from "./CampStatusLabel";
import { CAMP_EDIT_PAGE } from "../../../constants/Routes";

type CampsTableProps = {
  camps: CampResponse[];
  isDrawerOpen: boolean;
  onDrawerOpen: () => void;
  campDrawerInfo: CampResponse | undefined;
  setCampDrawerInfo: Dispatch<SetStateAction<CampResponse | undefined>>;
  onDeleteClick: (camp: CampResponse) => void;
  loading: boolean;
};

const CampsTable = ({
  camps,
  isDrawerOpen,
  onDrawerOpen,
  campDrawerInfo,
  setCampDrawerInfo,
  onDeleteClick,
  loading,
}: CampsTableProps): JSX.Element => {
  const filterOptions = [
    CampStatus.PUBLISHED,
    CampStatus.DRAFT,
    CampStatus.COMPLETED,
  ];
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<CampStatus | "">(
    "",
  );

  const history = useHistory();

  const onEditCampClick = (campID: string): void => {
    history.push(CAMP_EDIT_PAGE.replace(":id", campID));
  };

  const tableData = React.useMemo(() => {
    let filteredCamps = camps;
    if (selectedFilter === CampStatus.PUBLISHED) {
      filteredCamps = camps.filter(
        (camp) => getCampStatus(camp) === CampStatus.PUBLISHED,
      );
    } else if (selectedFilter === CampStatus.DRAFT) {
      filteredCamps = camps.filter(
        (camp) => getCampStatus(camp) === CampStatus.DRAFT,
      );
    } else if (selectedFilter === CampStatus.COMPLETED) {
      filteredCamps = camps.filter(
        (camp) => getCampStatus(camp) === CampStatus.COMPLETED,
      );
    }

    if (!search) {
      return filteredCamps;
    }

    return filteredCamps
      .filter(
        (camp) =>
          camp.name && camp.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort(compareCampDates);
  }, [search, selectedFilter, camps]);

  const handleFilterSelect = (selectedOption: CampStatus) => {
    // handle unselecting the current selected filter
    if (selectedFilter === selectedOption) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(selectedOption);
    }
  };

  return (
    <>
      <Container
        py="20px"
        maxWidth="100vw"
        backgroundColor="background.grey.100"
        borderRadius="20px 20px 0 0"
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
        variant="simple"
        colorScheme="blackAlpha"
        background="background.white.100"
      >
        <Thead>
          <Tr>
            <Th color="text.default.100">Camp Name</Th>
            <Th color="text.default.100">Camp Dates</Th>
            <Th color="text.default.100" justifyContent="center" display="flex">
              Camp Status
            </Th>
            <Th color="text.default.100"> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((camp, key) => (
            <Tr
              key={key}
              _hover={{
                background: "background.grey.100",
              }}
              background={
                isDrawerOpen && camp === campDrawerInfo
                  ? "background.grey.100"
                  : "background.white.100"
              }
            >
              <Td
                cursor="pointer"
                onClick={() => {
                  onDrawerOpen();
                  setCampDrawerInfo(camp);
                }}
              >
                <Text textStyle="bodyBold">{camp.name}</Text>
                <Text textStyle="bodyRegular">
                  {locationString(camp.location)}
                </Text>
              </Td>
              <Td
                cursor="pointer"
                onClick={() => {
                  onDrawerOpen();
                  setCampDrawerInfo(camp);
                }}
              >
                {getFormattedCampDateRange(camp)}
              </Td>
              <Td
                padding="0px"
                cursor="pointer"
                onClick={() => {
                  onDrawerOpen();
                  setCampDrawerInfo(camp);
                }}
              >
                <CampStatusLabel status={getCampStatus(camp)} />
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
                    {getCampStatus(camp) === CampStatus.DRAFT && (
                      <PopoverBody
                        as={Button}
                        bg="background.white.100"
                        onClick={() => onEditCampClick(camp.id)}
                        padding="1.5em 2em"
                      >
                        <Text textStyle="buttonRegular">Edit camp</Text>
                      </PopoverBody>
                    )}
                    <PopoverFooter
                      as={Button}
                      bg="background.white.100"
                      onClick={() => onDeleteClick(camp)}
                      padding="1.5em 2em"
                    >
                      <Text textStyle="buttonRegular" color="text.critical.100">
                        Delete camp
                      </Text>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {loading && (
        <Center bg="background.white.100" p="30px">
          <Spinner />
        </Center>
      )}
      {!loading && tableData.length === 0 && (
        <Center
          bg="background.white.100"
          color="text.grey.600"
          p="30px"
          textStyle="buttonSemiBold"
        >
          No results found
        </Center>
      )}
    </>
  );
};

export default CampsTable;
