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
  PopoverTrigger,
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
import React, { Dispatch, SetStateAction } from "react";
import { CampResponse, CampStatus } from "../../../types/CampsTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import {
  getCampStatus,
  getFormattedCampDateRange,
  locationString,
} from "../../../utils/CampUtils";
import CampStatusLabel from "./CampStatusLabel";
import DeleteCampConfirmationModel from "./DeleteCampConfirmationModel";

interface CampsTableProps {
  year: number;
  onDrawerOpen: () => void;
  setCampDrawerInfo: Dispatch<SetStateAction<CampResponse | undefined>>;
}

const CampsTable = (props: CampsTableProps): JSX.Element => {
  const { year, onDrawerOpen, setCampDrawerInfo } = props;

  const filterOptions = [
    CampStatus.PUBLISHED,
    CampStatus.DRAFT,
    CampStatus.COMPLETED,
  ];

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
      if (res) {
        setCamps(res);
        setCampDrawerInfo(res[0]);
      }
    };

    getCamps();
  }, [year]);

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

  const handleConfirmDelete = async () => {
    if (!campToEdit) {
      return;
    }
    const res = await CampsAPIClient.deleteCamp(campToEdit.id);
    if (res) {
      toast({
        description: `${campToEdit.name} has been succesfully deleted`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });

      const newCampsList: CampResponse[] = await camps.filter((camp) => {
        return camp.id !== campToEdit.id;
      });
      setCamps(newCampsList);
    } else {
      toast({
        description: `An error occurred with deleting ${campToEdit.name}. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
    onClose();
    setCampToEdit(null);
  };

  return (
    <>
      <DeleteCampConfirmationModel
        title="Delete Camp"
        bodyText={`Are you sure you want to delete ${campToEdit?.name}?`}
        bodyText2="Note: This action is irreversible."
        buttonLabel="Remove"
        buttonColor="red"
        isOpen={isOpen}
        onClose={onClose}
        onConfirmation={() => handleConfirmDelete()}
      />
      <Container
        py="20px"
        maxWidth="100vw"
        backgroundColor="background.grey.100"
        borderRadius="20px"
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
              <Td>
                {camp.campSessions.length > 0
                  ? getFormattedCampDateRange(
                      camp.campSessions[0].dates,
                      camp.campSessions[camp.campSessions.length - 1].dates,
                    )
                  : ""}
              </Td>
              <Td padding="0px" mr="px">
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
                    <PopoverBody
                      as={Button}
                      bg="background.white.100"
                      onClick={() => handleStatusChangePopoverTrigger(camp)}
                      padding="1.5em 2em"
                    >
                      <Text textStyle="buttonRegular" color="text.critical.100">
                        Delete camp
                      </Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {tableData.length === 0 && (
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
