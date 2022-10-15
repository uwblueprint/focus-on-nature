import { Container, Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import React from "react";
import { FontWeights } from "../../../theme/textStyles";
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
            <Text mb="0.5em" ml="5em" textStyle="displayXLarge"> 
            Form Management </Text>
        <Tabs variant='none' ml="9em">
            <TabList>
                <Tab 
                fontWeight='bold'
                _selected={{
                    color: "primary.green.100",
                    fontWeight: FontWeights.BOLD,
                    textDecoration: 'underline',
                  }}>Registration Form Template</Tab>
                <Tab 
                fontWeight='bold'
                _selected={{
                    color: "primary.green.100",
                    fontWeight: FontWeights.SEMIBOLD,
                    textDecoration: 'underline',
                  }}>Waiver Liability and Permission Form</Tab>
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