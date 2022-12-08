import React from "react";
import { Box, Button, Checkbox, Input, Text } from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../types/PersonalInfoTypes";
import { Camper, EmergencyContact } from "../../../../types/CamperTypes";
import { usePersonalInfoHook } from "./personalInfoReducer";

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
    <Box pb="12">
      {contactId === 0 ? (
        <Text textStyle="displayXLarge">Primary Contact</Text>
      ) : (
        <Text textStyle="displayXLarge">Secondary Contact</Text>
      )}
      <Text>First Name</Text>
      <Input
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
      <Text>Last Name</Text>
      <Input
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
      <Text>email</Text>
      <Input
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
      <Text>Phone Number</Text>
      <Input
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

      <Text>Relation To Camper</Text>
      <Input
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
    </Box>
  );
};

export default ContactCard;
