import React from "react";

import { Box, Center, Text, VStack } from "@chakra-ui/react";
import { CampSession } from "../../../types/CampsTypes";
import { CreateWaitlistedCamperDTO } from "../../../types/CamperTypes";
import RegistrationInfoCard from "../RegistrantExperience/RegistrationResult/RegistrationInfoCard";

const headingTextStyle = {
  sm: "xSmallBold",
  md: "bodyBold",
  lg: "displayXLarge",
};

const bodyTextStyles = {
  sm: "xSmallRegular",
  md: "xSmallRegular",
  lg: "displayMediumRegular",
};

const captionTextStyle = {
  sm: "xSmallBold",
  md: "captionSemiBold",
  lg: "displayLarge",
};

interface WaitlistConfirmationPageProps {
  campSessions: CampSession[];
  campers: CreateWaitlistedCamperDTO[];
  campName: string;
}

const WaitlistConfirmationPage = ({
  campSessions,
  campers,
  campName,
}: WaitlistConfirmationPageProps): React.ReactElement => {
  return (
    <Box>
      <Center
        bg="background.interactive.100"
        position="absolute"
        top={{ base: 0, lg: "68px" }}
        width="100vw"
        textAlign="center"
        color="text.success.100"
        textStyle="buttonSemiBold"
        height="60px"
        verticalAlign="center"
      >
        {" "}
        Registration successful: you may now close this window
      </Center>
      <VStack textAlign="center" py={12} spacing={7} px="10%">
        <Text textStyle={headingTextStyle} align="center">
          Thank you for registering for the waitlist!
        </Text>
        <Text textStyle={bodyTextStyles}>
          {`Thank you for joining the waitlist for the ${campName}. A
        Focus on Nature admin will send you an invite link via email to our
        registration process should a spot become available. You can now leave
        this page.`}
        </Text>
        <Text textStyle={captionTextStyle} color="primary.green.100">
          Waitlist Registration Information
        </Text>
        <RegistrationInfoCard
          imageSrc="src"
          campName={campName}
          sessions={campSessions}
          registeredCampers={campers}
          isWaitListSummary={!!true}
        />
      </VStack>
    </Box>
  );
};

export default WaitlistConfirmationPage;
