import React from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../types/PersonalInfoTypes";
import { Camper } from "../../../../types/CamperTypes";
import RequiredAsterisk from "../../../common/RequiredAsterisk";

type CamperCardProps = {
  camper: Camper;
  camperId: number;
  setPersonalInfo: (action: PersonalInfoReducerDispatch) => void;
};

const CamperCard = ({
  camper,
  camperId,
  setPersonalInfo,
}: CamperCardProps): React.ReactElement => {
  function AlertDialogExample() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef(null);

    return (
      <>
        <Button
          color="text.critical.100"
          variant="outline"
          onClick={onOpen}
          colorScheme="blue"
        >
          <DeleteIcon />
          <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }} pl={3}>
            Remove
          </Text>
        </Button>

        <AlertDialog
          isCentered
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay backgroundColor="overlay.dark.50">
            <AlertDialogContent>
              <AlertDialogHeader fontStyle="heading">
                Remove Camper
              </AlertDialogHeader>

              <AlertDialogBody>
                <Text textStyle="bodyRegular">
                  Are you sure you want to remove this camper from the
                  registration form? <br />
                  <br />
                  <Text as="span" textStyle="bodyBold">
                    Note: this action is irreversible.{" "}
                  </Text>
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setPersonalInfo({
                      type: PersonalInfoActions.DELETE_CAMPER,
                      camperId,
                    });
                    onClose();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1}>
      <Box backgroundColor="#FFFFFF" rounded="xl">
        <Heading textStyle="displayLarge">
          <Flex py="6" px={{ sm: "5", lg: "20" }} alignItems="center">
            <Text textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}>
              Camper #{camperId + 1}
            </Text>
            <Spacer />
            {camperId > 0 ? AlertDialogExample() : null}
          </Flex>
        </Heading>
        <Divider borderColor="border.secondary.100" />
      </Box>
      <Box px={{ sm: "5", lg: "20" }}>
        <Wrap pt="7">
          <WrapItem>
            <FormControl minWidth="250px" width={{ sm: "35vw", lg: "22vw" }}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  First Name{" "}
                  <Text
                    as="span"
                    color="text.critical.100"
                    fontSize="xs"
                    verticalAlign="super"
                  >
                    <RequiredAsterisk />
                  </Text>
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={camper.firstName}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "firstName",
                    camperId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem>
            <FormControl minWidth="250px" width={{ sm: "35vw", lg: "22vw" }}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Last Name{" "}
                  <Text
                    as="span"
                    color="text.critical.100"
                    fontSize="xs"
                    verticalAlign="super"
                  >
                    <RequiredAsterisk />
                  </Text>
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={camper.lastName}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "lastName",
                    camperId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem>
            <FormControl minWidth="250px" width={{ sm: "35vw", lg: "22vw" }}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Age{" "}
                  <Text
                    as="span"
                    color="text.critical.100"
                    fontSize="xs"
                    verticalAlign="super"
                  >
                    <RequiredAsterisk />
                  </Text>
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={camper.age !== -1 ? camper.age : ""}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "age",
                    camperId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />
        </Wrap>

        <Wrap py={7}>
          <WrapItem width={{ sm: "100%", md: "47%" }}>
            <FormControl>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Allergies
                </Text>
                <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>
                  Please list any allergies the camper has{" "}
                </Text>
              </FormLabel>

              <Textarea
                backgroundColor="#FFFFFF"
                value={camper.allergies ? camper.allergies : ""}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "allergies",
                    camperId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "47%" }}>
            <FormControl>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Special Needs
                </Text>
                <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>
                  Please list any special needs the camper has{" "}
                </Text>
              </FormLabel>

              <Textarea
                backgroundColor="#FFFFFF"
                value={camper.specialNeeds ? camper.specialNeeds : ""}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    field: "specialNeeds",
                    camperId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  );
};

export default CamperCard;
