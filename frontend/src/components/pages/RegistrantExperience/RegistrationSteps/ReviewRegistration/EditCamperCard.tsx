import React, { useMemo, useState } from "react";
import {
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
  useToast,
  Wrap,
  WrapItem,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../../types/PersonalInfoTypes";
import RequiredAsterisk from "../../../../common/RequiredAsterisk";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import {
  checkAge,
  checkFirstName,
  checkLastName,
} from "../PersonalInfo/personalInfoReducer";
import DeleteModal from "../../../../common/DeleteModal";
import { CampResponse } from "../../../../../types/CampsTypes";

type EditCamperCardProps = {
  camper: RegistrantExperienceCamper;
  camperIndex: number;
  camp: CampResponse;
  dispatchPersonalInfoAction: (action: PersonalInfoReducerDispatch) => void;
};

const EditCamperCard = ({
  camper,
  camperIndex,
  dispatchPersonalInfoAction,
  camp,
}: EditCamperCardProps): React.ReactElement => {
  const [updateMemo, setUpdateMemo] = useState(0);
  const initialCamper: RegistrantExperienceCamper = useMemo(() => camper, [
    updateMemo,
  ]);

  const [editing, setEditing] = useState(false);

  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState<boolean>(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState<boolean>(false);
  const [isAgeInvalid, setIsAgeInvalid] = useState<boolean>(false);

  const updateFormErrorMsgs = () => {
    let valid = true;

    if (!checkFirstName(camper.firstName)) {
      setIsFirstNameInvalid(true);
      valid = false;
    }
    if (!checkLastName(camper.lastName)) {
      setIsLastNameInvalid(true);
      valid = false;
    }
    if (!checkAge(camper.age, camp.ageUpper, camp.ageLower)) {
      setIsAgeInvalid(true);
      valid = false;
    }
    if (valid) {
      setEditing(false);
      setUpdateMemo(updateMemo + 1);
    }
  };

  const CancelChangesModal = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const deleteCamperModal = DeleteModal({
      title: "Discard Edits",
      bodyText: "Are you sure you want to discard all edits?",
      bodyNote: "Note: this action is irreversible.",
      buttonLabel: "Discard Edits",
      isOpen,
      onClose,
      onDelete: () => {
        setIsFirstNameInvalid(false);
        setIsLastNameInvalid(false);
        setIsAgeInvalid(false);

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CAMPER,
          field: "firstName",
          camperIndex,
          data: initialCamper.firstName,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CAMPER,
          field: "lastName",
          camperIndex,
          data: initialCamper.lastName,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CAMPER,
          field: "age",
          camperIndex,
          data: initialCamper.age,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CAMPER,
          field: "allergies",
          camperIndex,
          data: initialCamper.allergies,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CAMPER,
          field: "specialNeeds",
          camperIndex,
          data: initialCamper.specialNeeds,
        });

        setEditing(false);

        toast({
          description: `Edits have been discarded.`,
          status: "success",
          duration: 3000,
          isClosable: false,
          variant: "subtle",
        });
        onClose();
      },
    });

    return (
      <>
        <Button
          color="text.critical.100"
          variant="outline"
          onClick={onOpen}
          colorScheme="red"
          w={{ sm: "80px", lg: "100px" }}
          h={{ sm: "30px", lg: "40px" }}
        >
          <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
            Cancel
          </Text>
        </Button>
        {deleteCamperModal}
      </>
    );
  };

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%" mt={2} mb={2}>
      <Box backgroundColor="#FFFFFF" rounded="xl">
        <Heading textStyle="displayLarge">
          <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
            <Text textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}>
              {camper.firstName} {camper.lastName}
            </Text>
            <Spacer />
            <Button
              variant="secondary"
              textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
              disabled={editing}
              w={{ sm: "80px", lg: "100px" }}
              h={{ sm: "30px", lg: "40px" }}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </Flex>
        </Heading>
        <Divider borderColor="border.secondary.100" />
      </Box>

      <Box
        zIndex={0}
        backgroundColor="#FFFFFFAA"
        borderRadius="0px 0px 10px 10px"
        _hover={{ cursor: editing ? "auto" : "not-allowed" }}
      >
        <Box zIndex={editing ? 1 : -1} position="relative">
          <Box px={{ sm: "5", lg: "20" }}>
            <Wrap pt={7}>
              <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
                <FormControl isInvalid={isFirstNameInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
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
                    onChange={(event) => {
                      setIsFirstNameInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "firstName",
                        camperIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>

              <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
                <FormControl isInvalid={isLastNameInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
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
                    onChange={(event) => {
                      setIsLastNameInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "lastName",
                        camperIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>

              <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
                <FormControl isInvalid={isAgeInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
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
                    value={camper.age}
                    onChange={(event) => {
                      setIsAgeInvalid(false);
                      if (Number.isNaN(parseInt(event.target.value, 10))) {
                        dispatchPersonalInfoAction({
                          type: PersonalInfoActions.UPDATE_CAMPER,
                          field: "age",
                          camperIndex,
                          data: "",
                        });
                      } else {
                        dispatchPersonalInfoAction({
                          type: PersonalInfoActions.UPDATE_CAMPER,
                          field: "age",
                          camperIndex,
                          data: parseInt(event.target.value, 10),
                        });
                      }
                    }}
                  />

                  <FormErrorMessage>
                    Camper age must be between {camp.ageLower} - {camp.ageUpper}{" "}
                    years old
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
            </Wrap>

            <Wrap py={7}>
              <WrapItem width={{ sm: "100%", md: "47%" }}>
                <FormControl>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Allergies
                    </Text>
                    <Text
                      textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}
                    >
                      Please list any allergies the camper has{" "}
                    </Text>
                  </FormLabel>

                  <Textarea
                    backgroundColor="#FFFFFF"
                    value={camper.allergies ? camper.allergies : ""}
                    onChange={(event) =>
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "allergies",
                        camperIndex,
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
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Special Needs
                    </Text>
                    <Text
                      textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}
                    >
                      Please list any special needs the camper has{" "}
                    </Text>
                  </FormLabel>

                  <Textarea
                    backgroundColor="#FFFFFF"
                    value={camper.specialNeeds ? camper.specialNeeds : ""}
                    onChange={(event) =>
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "specialNeeds",
                        camperIndex,
                        data: event.target.value,
                      })
                    }
                  />
                </FormControl>
              </WrapItem>
            </Wrap>
          </Box>

          <Box rounded="xl">
            <Wrap>
              <Spacer />
              <WrapItem>
                <Heading textStyle="displayLarge">
                  <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
                    <Spacer />
                    <Button
                      variant="primary"
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                      w={{ sm: "80px", lg: "200px" }}
                      mr={4}
                      h={{ sm: "30px", lg: "40px" }}
                      onClick={updateFormErrorMsgs}
                    >
                      Save
                    </Button>
                    {CancelChangesModal()}
                  </Flex>
                </Heading>
              </WrapItem>
            </Wrap>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditCamperCard;
