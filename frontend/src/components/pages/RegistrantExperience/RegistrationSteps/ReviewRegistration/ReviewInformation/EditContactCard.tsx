import React, { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Spacer,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../../../types/PersonalInfoTypes";
import { EmergencyContact } from "../../../../../../types/CamperTypes";
import {
  checkEmail,
  checkFirstName,
  checkLastName,
  checkPhoneNumber,
  checkRelationToCamper,
} from "../../PersonalInfo/personalInfoReducer";
import EditFormLabel from "./EditFormLabel";
import EditCardFooter from "./EditCardFooter";
import EditCardHeader from "./EditCardHeader";

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialContact: EmergencyContact = useMemo(() => contact, [updateMemo]);

  const [editing, setEditing] = useState(false);

  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState(false);
  const [isRelationInvalid, setIsRelationInvalid] = useState(false);

  const updateFormErrorMsgs = () => {
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

  const EditContactOnDelete = () => {
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
  };

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%" mt={2} mb={2}>
      <EditCardHeader
        title={contactIndex === 0 ? "Primary Contact" : "Secondary Contact"}
        onClick={() => setEditing(true)}
        editing={editing}
      />

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
                  <EditFormLabel
                    title="First Name"
                    required={contactIndex === 0}
                  />
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
                  <EditFormLabel
                    title="Last Name"
                    required={contactIndex === 0}
                  />
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
                  <EditFormLabel title="Email" required={contactIndex === 0} />
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
                  <EditFormLabel
                    title="Phone Number"
                    required={contactIndex === 0}
                  />
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
                  <EditFormLabel
                    title="Relation To Camper"
                    required={contactIndex === 0}
                  />
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

          <EditCardFooter
            onDelete={EditContactOnDelete}
            updateFormErrorMsgs={updateFormErrorMsgs}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EditContactCard;
