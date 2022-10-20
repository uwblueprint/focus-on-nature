import { Container, Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import React from "react";
import RegistrationFormTemplate from "./RegistrationFormTemplate";
import WaiverLiabilityPermissionForm from "./WaiverLiabilityPermissionForm";

const FormManagement = (): JSX.Element => {
    return (
        <Container
            maxWidth="100vw"
            minHeight="100vh"
            px="10em"
            py="3em"
            background="background.grey.200"
            >
            <Text mb="1em" textStyle="displayXLarge">
                Form Management
            </Text>
            <Tabs variant="line" colorScheme="green">
                    <TabList>
                        <Tab fontWeight='bold'>
                            Registration Form Template 
                        </Tab>
                        <Tab fontWeight='bold'>
                            Waiver Liability and Permission Form
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <RegistrationFormTemplate />
                        </TabPanel>
                        <TabPanel>
                            <WaiverLiabilityPermissionForm />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
        </Container>
    );
};

export default FormManagement;