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
} from "@chakra-ui/react";
import React from "react";

const AccessManagementPage = (): JSX.Element => {
  const testUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      role: "Admin",
      active: true,
    },
    {
      id: 2,
      firstName: "Jessica",
      lastName: "Smith",
      email: "test@test.com",
      role: "Camp Coordinator",
      active: true,
    },

    {
      id: 3,
      firstName: "Adam",
      lastName: "Park",
      email: "test@test.com",
      role: "Camp Coordinator",
      active: true,
    },
    {
      id: 4,
      firstName: "Lee",
      lastName: "Doe",
      email: "test@test.com",
      role: "Admin",
      active: false,
    },
    {
      id: 5,
      firstName: "Jane",
      lastName: "Doe",
      email: "test@test.com",
      role: "Admin",
      active: true,
    },
    {
      id: 6,
      firstName: "Jeff",
      lastName: "Banks",
      email: "test@test.com",
      role: "Admin",
      active: false,
    },
  ];

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

  const [users, setUsers] = React.useState(testUsers);
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<Filter>(
    Filter.ALL,
  );

  const tableData = React.useMemo(() => {
    let filteredUsers;
    if (selectedFilter === Filter.ALL) filteredUsers = users;
    else if (selectedFilter === Filter.ACTIVE)
      filteredUsers = users.filter((user) => user.active);
    else filteredUsers = users.filter((user) => !user.active);

    if (!search) return filteredUsers;
    return users.filter(
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
      px="20"
      py="20"
      background="background.grey.100"
    >
      <Text mb="40px" textStyle="displayXLarge">
        FON Staff Access Control
      </Text>

      <HStack spacing={12}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            size="md"
            enterKeyHint="enter"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
          />
        </InputGroup>
        <HStack>
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
                {option}
              </Tag>
            );
          })}
        </HStack>
      </HStack>

      <Table
        background="background.white.100"
        variant="striped"
        colorScheme="blackAlpha"
        mt="30px"
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
                  {userRoles.map((role) => {
                    return (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    );
                  })}
                </Select>
              </Td>
              <Td>
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme={user.active ? "green" : "red"}
                  width="6em"
                  px="1.5em"
                >
                  {user.active ? Filter.ACTIVE : Filter.INACTIVE}
                </Tag>
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

export default AccessManagementPage;
