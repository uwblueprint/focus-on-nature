import { SearchIcon } from "@chakra-ui/icons";
import { FaEllipsisV } from "react-icons/fa";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import textStyles from "../../../../theme/textStyles";
import {
  WaitlistedCamper,
  UpdateWaitlistedStatusType,
} from "../../../../types/CamperTypes";
import CamperAPIClient from "../../../../APIClients/CamperAPIClient";
import { WaitlistDetailsBadgeGroup } from "./CamperDetailsBadge";
import GeneralDeleteCamperModal from "../../../common/GeneralDeleteCamperModal";

const WaitlistedCampersTable = ({
  waitlistedCampers,
}: {
  waitlistedCampers: WaitlistedCamper[];
}): JSX.Element => {
  const [campers, setCampers] = React.useState(waitlistedCampers);
  const [search, setSearch] = React.useState("");
  const [
    camperToDelete,
    setCamperToDelete,
  ] = React.useState<WaitlistedCamper | null>(null);

  const tableData = React.useMemo(() => {
    const filteredCampers = campers;

    if (!search) return filteredCampers;
    return filteredCampers.filter((camper: WaitlistedCamper) =>
      camper.firstName
        .toLowerCase()
        .concat(" ", camper.lastName.toLowerCase())
        .includes(search.toLowerCase()),
    );
  }, [search, campers]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateCamperRegistrationStatus = async (
    waitlistedCamper: WaitlistedCamper,
  ) => {
    const newWaitlistStatus: UpdateWaitlistedStatusType = {
      status: "RegistrationFormSent",
    };
    const updatedCamperRegistrationStatusResponse: WaitlistedCamper = await CamperAPIClient.updateCamperRegistrationStatus(
      waitlistedCamper.id,
      newWaitlistStatus,
    );
    if (updatedCamperRegistrationStatusResponse.id) {
      toast({
        description:
          "Registration link has been sent and they will be notified.",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    } else {
      toast({
        description: "Registration link cannot be sent. Please try again.",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    }
  };

  const deleteWaitlistedCameper = async (
    waitlistedCamper: WaitlistedCamper,
  ) => {
    setCamperToDelete(waitlistedCamper);
    onOpen();
  };

  const confirmDeleteWaitlistedCamper = async (
    waitlistedCamper: WaitlistedCamper | null,
  ) => {
    if (waitlistedCamper) {
      const deletedCamperName: string = camperToDelete
        ? `${camperToDelete.firstName}`.concat(` ${camperToDelete.lastName}`)
        : "FirstName LastName";

      const deletedWaitlistedCamperResponse = await CamperAPIClient.deleteWaitlistedCamperById(
        waitlistedCamper.id,
      );

      onClose();
      if (deletedWaitlistedCamperResponse) {
        toast({
          description: deletedCamperName.concat(
            " has been removed from the waitlist for this camp session.",
          ),
          status: "success",
          duration: 7000,
          isClosable: true,
        });
      } else {
        toast({
          description: deletedCamperName.concat(
            " could not be deleted from this camp session.",
          ),
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box px="-5" py="5" background="background.grey.100" borderRadius="20">
      {waitlistedCampers.length > 0 ? (
        <>
          <GeneralDeleteCamperModal
            title={"Remove ".concat(
              camperToDelete
                ? `${camperToDelete.firstName} ${camperToDelete.lastName}`
                : "FirstName LastName",
            )}
            bodyText={"Are you sure you want to remove "
              .concat(
                camperToDelete
                  ? `${camperToDelete.firstName} ${camperToDelete.lastName}`
                  : "FirstName LastName",
              )
              .concat(" from the waitlist?")}
            bodyNote="Note: this action is irreversible."
            buttonLabel="Remove"
            isOpen={isOpen}
            onClose={onClose}
            onDelete={() => confirmDeleteWaitlistedCamper(camperToDelete)}
          />
          <HStack spacing={12} px="18">
            <InputGroup>
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
            <HStack
              ps="10vw"
              pe="1.5vw"
              color="secondary.critical.100"
              textStyle="buttonSemiBold"
            >
              <FontAwesomeIcon icon={faPerson} />
              <Text>{waitlistedCampers.length}</Text>
            </HStack>
          </HStack>

          <Table
            background="background.white.100"
            colorScheme="blackAlpha"
            variant="simple"
            pl="5px"
            mt="20px"
            mb="20px"
          >
            <Thead margin="16px 0">
              <Tr>
                <Td>Camper</Td>
                <Td>Camper Contact Information</Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
                <Td>&nbsp;</Td>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((camper, i) => (
                <Tr key={i} margin="16px 0">
                  <Td maxWidth="210px">
                    <VStack align="start">
                      <Text style={textStyles.buttonSemiBold}>
                        {camper.firstName}&nbsp;{camper.lastName}
                      </Text>
                      <Text>Age:&nbsp;{camper.age}</Text>
                    </VStack>
                  </Td>
                  <Td paddingRight="0px" maxWidth="320px">
                    <VStack align="start">
                      <Text style={textStyles.buttonSemiBold}>
                        {camper.contactName}
                      </Text>
                      <Text>
                        {camper.contactNumber}&nbsp;|&nbsp;{camper.contactEmail}
                      </Text>
                    </VStack>
                  </Td>
                  <Td paddingLeft="0px" maxWidth="790px">
                    <WaitlistDetailsBadgeGroup
                      status={camper.status}
                      linkExpiry={camper.linkExpiry}
                    />
                  </Td>
                  <Td minWidth="20vw">
                    <Text>&nbsp;</Text>
                  </Td>
                  <Td
                    justifyContent="flex-end"
                    margin="0px"
                    padding="0px"
                    maxWidth="32px"
                  >
                    <Popover placement="bottom-end">
                      <PopoverTrigger>
                        <IconButton
                          aria-label="Mark as active button"
                          icon={<FaEllipsisV />}
                          variant=""
                        />
                      </PopoverTrigger>
                      <PopoverContent width="inherit">
                        <PopoverHeader
                          as={Button}
                          bg="background.white.100"
                          onClick={() => updateCamperRegistrationStatus(camper)}
                        >
                          <Text textStyle="buttonRegular">
                            Send registration form
                          </Text>
                        </PopoverHeader>
                        <PopoverBody
                          as={Button}
                          bg="background.white.100"
                          onClick={() => {
                            console.log(camper);
                            deleteWaitlistedCameper(camper);
                          }}
                        >
                          <Text
                            textStyle="buttonRegular"
                            textColor="text.critical.100"
                          >
                            Remove
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      ) : (
        <VStack pb="18px" pt="18px">
          <Text style={textStyles.buttonSemiBold}>
            No campers on the waitlist yet
          </Text>
          <Text>Check back later!</Text>
        </VStack>
      )}
    </Box>
  );
};

export default WaitlistedCampersTable;
