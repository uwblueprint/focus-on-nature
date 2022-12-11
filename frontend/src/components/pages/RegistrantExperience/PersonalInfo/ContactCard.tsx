import React from "react";
import {
  Box,
  Divider,
  FormControl,
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

type ContactCardProps = {
  contact: EmergencyContact;
  contactId: number;
  setPersonalInfo: (action: PersonalInfoReducerDispatch) => void;
};

const ContactCard = ({
  contact,
  contactId,
  setPersonalInfo,
}: ContactCardProps): React.ReactElement => {
  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1}>
      <Box backgroundColor="#FFFFFF" rounded="xl">
        <Heading textStyle="displayLarge">
          <Text
            py="6"
            px={{ sm: "5", lg: "20" }}
            textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}
          >
            {contactId === 0 ? "Primary Contact" : "Secondary Contact"}{" "}
          </Text>
        </Heading>
        <Divider borderColor="border.secondary.100" />
      </Box>

      <Box px={{ sm: "5", lg: "20" }}>
        <Wrap pt="7">
          <WrapItem>
            <FormControl minWidth="250px" width={{ sm: "35vw", lg: "12vw" }}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  First Name <RequiredAsterisk />
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.firstName}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "firstName",
                    contactId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem>
            <FormControl minWidth="250px" width={{ sm: "35vw", lg: "12vw" }}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Last Name <RequiredAsterisk />
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.lastName}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "lastName",
                    contactId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />
          <WrapItem>
            <FormControl minWidth="250px" width={{ sm: "35vw", lg: "12vw" }}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Email <RequiredAsterisk />
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.email}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "email",
                    contactId,
                    data: event.target.value,
                  })
                }
              />
            </FormControl>
          </WrapItem>
          <Spacer />

          <WrapItem>
            <FormControl minWidth="250px" width={{ sm: "35vw", lg: "12vw" }}>
              <FormLabel>
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Phone Number <RequiredAsterisk />
                </Text>
              </FormLabel>
              <Input
                backgroundColor="#FFFFFF"
                value={contact.phoneNumber}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "phoneNumber",
                    contactId,
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
                  Relation To Camper <RequiredAsterisk />
                </Text>
              </FormLabel>
              <Textarea
                backgroundColor="#FFFFFF"
                value={contact.relationshipToCamper}
                onChange={(event) =>
                  setPersonalInfo({
                    type: PersonalInfoActions.UPDATE_CONTACT,
                    field: "relationshipToCamper",
                    contactId,
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

export default ContactCard;
