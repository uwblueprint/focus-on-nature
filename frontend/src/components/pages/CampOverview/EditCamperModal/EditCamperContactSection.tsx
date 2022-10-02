import React from "react";

import { VStack, Heading, HStack, Input, FormLabel } from "@chakra-ui/react";

import { EmergencyContact } from "../../../../types/CamperTypes";

const EditCamperContactSection = ({
    contacts,
    camperName,
    setContacts,
  }: {
    contacts : EmergencyContact[];
    camperName : string;
    setContacts: (contacts: EmergencyContact[]) => void;
  }) => {
    
    return contacts.length > 0 ? (
      <VStack align="start" minW="100%">
        {
          contacts.map((contact, index) => {
            return (
              <VStack align="start" key={`${camperName}_contact_${index}`} minW="100%">
                <Heading marginBottom="5px" as="h3" size='md'>{index === 0 ? "Primary contact" : "Secondary contact"}</Heading>
                <HStack align="start" minW="100%">
                  <VStack align="start" flexGrow="1">
                    <FormLabel><b>First name</b></FormLabel>
                    <Input 
                      value={contact.firstName}
                    />
                  </VStack>
                  <VStack align="start" flexGrow="1">
                    <FormLabel><b>Last name</b></FormLabel>
                    <Input defaultValue={contact.lastName}/>
                  </VStack>
                </HStack>
                <HStack align="start" minW="100%">
                  <VStack align="start" flexGrow="1">
                    <FormLabel><b>Email</b></FormLabel>
                    <Input defaultValue={contact.email}/>
                  </VStack>
                  <VStack align="start" flexGrow="1">
                    <FormLabel><b>Relationship to camper</b></FormLabel>
                    <Input defaultValue={contact.relationshipToCamper}/>
                  </VStack>
                </HStack>
                <br/>
              </VStack>
            )
          })
        }
      </VStack>
  
    ) : null
}

export default EditCamperContactSection;
  