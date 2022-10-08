import React from "react";
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import RegistrationFormTemplate from "./RegistrationFormTemplate";
import WaiverLiabilityPermissionForm from "./WaiverLiabilityPermissionForm";

const FormManagement = (): JSX.Element => {
    return (
        <Container
            maxWidth="100vw"
            minHeight="100vh"
            px="3em"
            py="3em"
            background="background.grey.200">
            <Text mb="35px" textStyle="displayXLarge"> 
            Form Management </Text>
        <Tabs>
            <TabList>
                <Tab>Registration Form Template</Tab>
                <Tab>Waiver Liability and Permission Form</Tab>
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