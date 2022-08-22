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
} from "@chakra-ui/react";
import React from "react";
import UserStatusLabel from "./UserStatusLabel";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import { UserResponse } from "../../../types/UserTypes";
import { Role } from "../../../types/AuthTypes";

const AccessControlPage = (): JSX.Element => {
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

  const [users, setUsers] = React.useState([] as UserResponse[]);
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<Filter>(
    Filter.ALL,
  );

  React.useEffect(() => {
    const getUsers = async () => {
      const res = await UserAPIClient.getAllUsers();
      if (res.length !== undefined) setUsers(res);
    };

    getUsers();
  }, []);

  const tableData = React.useMemo(() => {
    let filteredUsers;
    if (selectedFilter === Filter.ALL) filteredUsers = users;
    else if (selectedFilter === Filter.ACTIVE)
      filteredUsers = users.filter((user) => user.active);
    else filteredUsers = users.filter((user) => !user.active);

    if (!search) return filteredUsers;
    return filteredUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.firstName
          .toLowerCase()
          .concat(" ", user.lastName.toLowerCase())
          .includes(search.toLowerCase()),
    );
  }, [search, selectedFilter, users]);

  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      px="3em"
      py="3em"
      background="background.grey.200"
    >
      <Text mb="35px" textStyle="displayXLarge">
        FON Staff Access Control
      </Text>
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
              placeholder="Search by name or email"
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
                  px={option === Filter.ALL ? "2em" : "1em"}
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
            <Th color="text.default.100">Name</Th>
            <Th color="text.default.100">Email</Th>
            <Th color="text.default.100">Role</Th>
            <Th color="text.default.100">Status</Th>
            <Th color="text.default.100"> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((user, key) => (
            <Tr key={key}>
              <Td>{`${user.firstName} ${user.lastName}`}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Select value={user.role}>
                  <option value={Role.ADMIN}>{UserRoles.ADMIN}</option>
                  <option value={Role.CAMP_COORDINATOR}>
                    {UserRoles.CAMP_COORDINATOR}
                  </option>
                </Select>
              </Td>
              <Td pl="0px">
                <UserStatusLabel
                  active={user.active}
                  value={user.active ? Filter.ACTIVE : Filter.INACTIVE}
                />
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
    </Container>
  );
};

export default AccessControlPage;
