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
  Select,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import UserStatusLabel from "./UserStatusLabel";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import { UserResponse } from "../../../types/UserTypes";
import { Role } from "../../../types/AuthTypes";
import ConfirmStatusChangeModal from "./ConfirmStatusChangeModal";

const AccessControlPage = (): JSX.Element => {
  enum UserStatusStates {
    ALL = "All",
    ACTIVE_CAPITALIZED = "Active",
    INACTIVE_CAPITALIZED = "Inactive",
    ACTIVE_NO_CAP = "active",
    INACTIVE_NO_CAP = "inactive",
  }

  enum UserRoles {
    ADMIN = "FON Admin",
    CAMP_COORDINATOR = "Camp Coordinator",
  }

  const filterOptions = [
    UserStatusStates.ALL,
    UserStatusStates.ACTIVE_CAPITALIZED,
    UserStatusStates.INACTIVE_CAPITALIZED,
  ];

  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState([] as UserResponse[]);
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<UserStatusStates>(
    UserStatusStates.ALL,
  );
  const [
    userToChangeStatus,
    setUserToChangeStatus,
  ] = React.useState<UserResponse | null>(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    const getUsers = async () => {
      const res = await UserAPIClient.getAllUsers();
      if (res.length !== undefined) setUsers(res);
      setLoading(false);
    };

    getUsers();
  }, []);

  const tableData = React.useMemo(() => {
    let filteredUsers;
    if (selectedFilter === UserStatusStates.ALL) filteredUsers = users;
    else if (selectedFilter === UserStatusStates.ACTIVE_CAPITALIZED)
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
  }, [
    search,
    selectedFilter,
    users,
    UserStatusStates.ACTIVE_CAPITALIZED,
    UserStatusStates.ALL,
  ]);

  const handleRoleChange = async (user: UserResponse, newRole: Role) => {
    const newUserData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: newRole,
      active: user.active,
    };
    const res = await UserAPIClient.updateUserById(user.id, newUserData);
    if (res) {
      toast({
        description: `${user.firstName} ${
          user.lastName
        }'s role has been changed to ${
          newRole === Role.ADMIN ? UserRoles.ADMIN : UserRoles.CAMP_COORDINATOR
        }`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });

      const newUsers: UserResponse[] = await users.map((u) => {
        if (u.id === user.id) {
          return { ...u, role: newRole };
        }
        return u;
      });
      setUsers(newUsers);
    } else {
      toast({
        description: `An error occurred with changing ${user.firstName} ${user.lastName}'s role. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  const handleStatusChangePopoverTrigger = (user: UserResponse) => {
    setUserToChangeStatus(user);
    onOpen();
  };

  const handleStatusChange = async (user: UserResponse) => {
    const newUserData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      active: !user.active,
    };

    const res = await UserAPIClient.updateUserById(user.id, newUserData);
    if (res) {
      toast({
        description: newUserData.active
          ? `${user.firstName} ${user.lastName} can now access the Camp Management Tool`
          : `${user.firstName} ${user.lastName} can no longer access the Camp Management Tool`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });

      const newUsers: UserResponse[] = await users.map((u) => {
        if (user && u.id === user.id) {
          return { ...u, active: newUserData.active };
        }
        return u;
      });
      setUsers(newUsers);
    } else {
      toast({
        description: `An error occurred with changing ${user.firstName} ${user.lastName}'s status. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
    onClose();
    setUserToChangeStatus(null);
  };

  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      px="3em"
      py="3em"
      background="background.grey.200"
    >
      <ConfirmStatusChangeModal
        title={`Mark ${userToChangeStatus?.firstName} ${
          userToChangeStatus?.lastName
        } as ${
          userToChangeStatus?.active
            ? UserStatusStates.INACTIVE_NO_CAP
            : UserStatusStates.ACTIVE_NO_CAP
        }`}
        bodyText={`Are you sure you want to mark ${
          userToChangeStatus?.firstName
        } ${userToChangeStatus?.lastName} as ${
          userToChangeStatus?.active
            ? UserStatusStates.INACTIVE_NO_CAP
            : UserStatusStates.ACTIVE_NO_CAP
        }?`}
        buttonLabel={`Mark as ${
          userToChangeStatus?.active
            ? UserStatusStates.INACTIVE_NO_CAP
            : UserStatusStates.ACTIVE_NO_CAP
        }`}
        buttonColor={userToChangeStatus?.active ? "red" : "green"}
        isOpen={isOpen}
        onClose={onClose}
        onChangeStatus={() =>
          userToChangeStatus && handleStatusChange(userToChangeStatus)
        }
      />
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
                  px={option === UserStatusStates.ALL ? "2em" : "1em"}
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
            <Th color="text.default.100" justifyContent="center" display="flex">
              Status
            </Th>
            <Th color="text.default.100"> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((user, key) => (
            <Tr key={key}>
              <Td>{`${user.firstName} ${user.lastName}`}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Select
                  value={user.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleRoleChange(user, e.target.value as Role)
                  }
                >
                  <option value={Role.ADMIN}>{UserRoles.ADMIN}</option>
                  <option value={Role.CAMP_COORDINATOR}>
                    {UserRoles.CAMP_COORDINATOR}
                  </option>
                </Select>
              </Td>
              <Td pl="0px">
                <UserStatusLabel
                  active={user.active}
                  value={
                    user.active
                      ? UserStatusStates.ACTIVE_CAPITALIZED
                      : UserStatusStates.INACTIVE_CAPITALIZED
                  }
                />
              </Td>
              <Td>
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Mark as active button"
                      icon={<FaEllipsisV />}
                      variant=""
                    />
                  </PopoverTrigger>
                  <PopoverContent width="inherit">
                    <PopoverBody
                      as={Button}
                      bg="background.white.100"
                      onClick={() => handleStatusChangePopoverTrigger(user)}
                    >
                      <Text textStyle="buttonRegular">
                        Mark as{" "}
                        {user.active
                          ? UserStatusStates.INACTIVE_NO_CAP
                          : UserStatusStates.ACTIVE_NO_CAP}
                      </Text>
                    </PopoverBody>
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
    </Container>
  );
};

export default AccessControlPage;
