import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../types/PersonalInfoTypes";
import { EmergencyContact } from "../../../../types/CamperTypes";
import RequiredAsterisk from "../../../common/RequiredAsterisk";
import {
  checkEmail,
  checkFirstName,
  checkLastName,
  checkPhoneNumber,
  checkRelationToCamper,
} from "./personalInfoReducer";

type ContactCardProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  contact: EmergencyContact;
  contactIndex: number;
  dispatchPersonalInfoAction: (action: PersonalInfoReducerDispatch) => void;
};

const ContactCard = ({
  nextBtnRef,
  contact,
  contactIndex,
  dispatchPersonalInfoAction,
}: ContactCardProps): React.ReactElement => {
  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState<boolean>(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState<boolean>(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);
  const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState<boolean>(
    false,
  );
  const [isRelationInvalid, setIsRelationInvalid] = useState<boolean>(false);

  useEffect(() => {
    let nextBtnRefValue: HTMLButtonElement; // Reference to the next step button
    const updateFormErrorMsgs = () => {
      console.log(
        "contact",
        checkFirstName(contact.firstName),
        checkLastName(contact.lastName),
        checkEmail(contact.email),
      );
      if (!checkFirstName(contact.firstName)) setIsFirstNameInvalid(true);
      if (!checkLastName(contact.lastName)) setIsLastNameInvalid(true);
      if (!checkEmail(contact.email)) setIsEmailInvalid(true);
      if (!checkPhoneNumber(contact.phoneNumber)) setIsPhoneNumberInvalid(true);
      if (!checkRelationToCamper(contact.relationshipToCamper))
        setIsRelationInvalid(true);
    };

    if (nextBtnRef && nextBtnRef.current) {
      nextBtnRefValue = nextBtnRef.current;
      nextBtnRefValue.addEventListener("click", updateFormErrorMsgs);
    }

    return () => {
      if (nextBtnRefValue) {
        nextBtnRefValue.removeEventListener("click", updateFormErrorMsgs);
      }
    };
  }, [contact, nextBtnRef]);

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%">
      <Box backgroundColor="#FFFFFF" rounded="xl">
        <Heading textStyle="displayLarge">
          <Text
            py={6}
            px={{ sm: "5", lg: "20" }}
            textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}
          >
            {contactIndex === 0 ? "Primary Contact" : "Secondary Contact"}{" "}
          </Text>
        </Heading>
        <Divider borderColor="border.secondary.100" />
      </Box>

      <Box px={{ sm: "5", lg: "20" }}>
        <Wrap pt="7">
          <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
            <FormControl isInvalid={isFirstNameInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  First Name <RequiredAsterisk />
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
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
            <FormControl isInvalid={isLastNameInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Last Name <RequiredAsterisk />
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
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "45%", lg: "20%" }}>
            <FormControl isInvalid={isEmailInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Email <RequiredAsterisk />
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
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem width={{ sm: "100%", md: "45%", lg: "25%" }}>
            <FormControl isInvalid={isPhoneNumberInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Phone Number <RequiredAsterisk />
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
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
          <Spacer />
        </Wrap>

        <Wrap py={7}>
          <WrapItem width={{ sm: "100%", md: "47%" }}>
            <FormControl isInvalid={isRelationInvalid}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Relation To Camper <RequiredAsterisk />
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
              <FormErrorMessage>This field cannot be empty</FormErrorMessage>
            </FormControl>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  );
};

export default ContactCard;
