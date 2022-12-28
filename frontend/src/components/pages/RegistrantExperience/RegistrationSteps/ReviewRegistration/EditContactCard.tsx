import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
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
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../../types/PersonalInfoTypes";
import { EmergencyContact } from "../../../../../types/CamperTypes";
import RequiredAsterisk from "../../../../common/RequiredAsterisk";
import DeleteModal from "../../../../common/DeleteModal";
import {
  checkEmail,
  checkFirstName,
  checkLastName,
  checkPhoneNumber,
  checkRelationToCamper,
} from "../PersonalInfo/personalInfoReducer";

type EditContactCardProps = {
  contact: EmergencyContact;
  contactIndex: number;
  dispatchPersonalInfoAction: (action: PersonalInfoReducerDispatch) => void;
};

const EditContactCard = ({
  contact,
  contactIndex,
  dispatchPersonalInfoAction,
}: EditContactCardProps): React.ReactElement => {
  const [updateMemo, setUpdateMemo] = useState(0);
  const initialContact: EmergencyContact = useMemo(() => contact, [updateMemo]);

  const [editing, setEditing] = useState(false);

  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState<boolean>(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState<boolean>(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);
  const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState<boolean>(
    false,
  );
  const [isRelationInvalid, setIsRelationInvalid] = useState<boolean>(false);

  const updateFormErrorMsgs = () => {
    // Check if we're on secondary contact. If so, then we display error messages only if user has started filling secondary contact.
    if (
      contactIndex === 1 &&
      !(
        contact.firstName ||
        contact.lastName ||
        contact.email ||
        contact.phoneNumber ||
        contact.relationshipToCamper
      )
    ) {
      setIsFirstNameInvalid(false);
      setIsLastNameInvalid(false);
      setIsEmailInvalid(false);
      setIsPhoneNumberInvalid(false);
      setIsRelationInvalid(false);
      return;
    }

    let valid = true;

    if (!checkFirstName(contact.firstName)) {
      setIsFirstNameInvalid(true);
      valid = false;
    }
    if (!checkLastName(contact.lastName)) {
      setIsLastNameInvalid(true);
      valid = false;
    }
    if (!checkEmail(contact.email)) {
      setIsEmailInvalid(true);
      valid = false;
    }
    if (!checkPhoneNumber(contact.phoneNumber)) {
      setIsPhoneNumberInvalid(true);
      valid = false;
    }
    if (!checkRelationToCamper(contact.relationshipToCamper)) {
      setIsRelationInvalid(true);
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
        setIsEmailInvalid(false);
        setIsPhoneNumberInvalid(false);
        setIsRelationInvalid(false);

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CONTACT,
          field: "firstName",
          contactIndex,
          data: initialContact.firstName,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CONTACT,
          field: "lastName",
          contactIndex,
          data: initialContact.lastName,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CONTACT,
          field: "email",
          contactIndex,
          data: initialContact.email,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CONTACT,
          field: "phoneNumber",
          contactIndex,
          data: initialContact.phoneNumber,
        });

        dispatchPersonalInfoAction({
          type: PersonalInfoActions.UPDATE_CONTACT,
          field: "relationshipToCamper",
          contactIndex,
          data: initialContact.relationshipToCamper,
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
              {contactIndex === 0 ? "Primary Contact" : "Secondary Contact"}{" "}
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
            <Wrap pt="7">
              <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
                <FormControl isInvalid={isFirstNameInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      First Name {contactIndex === 0 && <RequiredAsterisk />}
                    </Text>
                  </FormLabel>
                  <Input
                    backgroundColor="#FFFFFF"
                    value={contact.firstName}
                    onChange={(event) => {
                      setIsFirstNameInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CONTACT,
                        field: "firstName",
                        contactIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
              <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
                <FormControl isInvalid={isLastNameInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Last Name {contactIndex === 0 && <RequiredAsterisk />}
                    </Text>
                  </FormLabel>
                  <Input
                    backgroundColor="#FFFFFF"
                    value={contact.lastName}
                    onChange={(event) => {
                      setIsLastNameInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CONTACT,
                        field: "lastName",
                        contactIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
              <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
                <FormControl isInvalid={isEmailInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Email {contactIndex === 0 && <RequiredAsterisk />}
                    </Text>
                  </FormLabel>
                  <Input
                    backgroundColor="#FFFFFF"
                    value={contact.email}
                    onChange={(event) => {
                      setIsEmailInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CONTACT,
                        field: "email",
                        contactIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
              <WrapItem width={{ sm: "100%", md: "45%", lg: "25%" }}>
                <FormControl isInvalid={isPhoneNumberInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Phone Number {contactIndex === 0 && <RequiredAsterisk />}
                    </Text>
                  </FormLabel>
                  <Input
                    backgroundColor="#FFFFFF"
                    value={contact.phoneNumber}
                    onChange={(event) => {
                      setIsPhoneNumberInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CONTACT,
                        field: "phoneNumber",
                        contactIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
              <Spacer />
            </Wrap>

            <Wrap py={7}>
              <WrapItem width={{ sm: "100%", md: "47%" }}>
                <FormControl isInvalid={isRelationInvalid}>
                  <FormLabel>
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Relation To Camper{" "}
                      {contactIndex === 0 && <RequiredAsterisk />}
                    </Text>
                  </FormLabel>
                  <Textarea
                    backgroundColor="#FFFFFF"
                    value={contact.relationshipToCamper}
                    onChange={(event) => {
                      setIsRelationInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CONTACT,
                        field: "relationshipToCamper",
                        contactIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
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

export default EditContactCard;
