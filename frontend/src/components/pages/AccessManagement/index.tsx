import { SearchIcon } from "@chakra-ui/icons";
import {
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
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
            active: true
        },
        {
            id: 2,
            firstName: "John",
            lastName: "Doe",
            email: "test@test.com",
            role: "Camp Coordinator",
            active: true
        },

        {
            id: 3,
            firstName: "Jane",
            lastName: "Doe",
            email: "test@test.com",
            role: "Camp Coordinator",
            active: true
        },
        {
            id: 4,
            firstName: "John",
            lastName: "Doee",
            email: "test@test.com",
            role: "Admin",
            active: false
        },
        {
            id: 5,
            firstName: "Jane",
            lastName: "Doe",
            email: "test@test.com",
            role: "Admin",
            active: true
        },
        {
            id: 6,
            firstName: "John",
            lastName: "Doee",
            email: "test@test.com",
            role: "Admin",
            active: false
        },
    ]
  const [users, setUsers] = React.useState(testUsers);
  const [search, setSearch] = React.useState("");

  const tableData = React.useMemo(() => {
    if (!search) return users;
    return users.filter(
      (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName
          .toLowerCase()
          .concat(" ", user.lastName.toLowerCase())
          .includes(search.toLowerCase())
    );
  }, [search, users]);
 
  return (
    <Container maxWidth="100vw" px="20" py="20" background="background.grey.100">
      <Text mb="40px" textStyle="displayXLarge">
        FON Staff Access Control
      </Text>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          enterKeyHint="enter"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
        />
      </InputGroup>

      <Table background="background.white.100" variant="unstyled" colorScheme="blackAlpha" mt="30px">
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
              <Td>{user.role}</Td>
              <Td>{user.active}</Td>
              <Td>...</Td>
            </Tr>
          ))} 
        </Tbody>
      </Table>
    </Container>
  );
};

export default AccessManagementPage;
