import React from "react";
import { Text, Flex, VStack, HStack, Image } from "@chakra-ui/react";
import { Redirect, useLocation } from "react-router-dom";
import {
  CAMP_REGISTER_BASE,
  REGISTRATION_CANCEL_PAGE,
} from "../../../../constants/Routes";
import {
  CAMP_ID_SESSION_STORAGE_KEY,
  getCheckoutSessionStorageKey,
  getFailedSessionStorageKey,
} from "..";
import { CartItem } from "../../../../types/RegistrationTypes";

import defaultCampImage from "../../../../assets/default_camp_image.png";

const subheadingStyles = {
  sm: "xSmallBold",
  md: "captionSemiBold",
  lg: "displayLarge",
};

const regularTextStyles = { base: "xSmallRegular", lg: "displaySmallRegular" };

type RegistrationInfoCardProps = {
  imageSrc: string;
  campName: string;
  sessions: string;
  registeredCampers: string;
};

const RegistrationInfoCard = ({
  imageSrc,
  campName,
  sessions,
  registeredCampers,
}: RegistrationInfoCardProps): React.ReactElement => {
  return (
    <Flex
      direction="row"
      justify="space-between"
      align="center"
      w="100%"
      border="1px solid"
      borderColor="border.default.100"
      borderRadius="10px"
      backgroundColor="background.grey.200"
      py={10}
      px={5}
      flexWrap="wrap"
    >
      <Image
        fallbackSrc={defaultCampImage}
        src={imageSrc}
        alt="Camp image"
        w={{ base: "192px", lg: "6vw" }}
        h={{ base: "122px", lg: "6vh" }}
        mb={{ sm: 5 }}
      />
      <VStack align="flex-start" spacing={2} w={{ lg: "25vw" }}>
        <Text textStyle={{ base: "xSmallBold", lg: "displayMediumBold" }}>
          {campName}
        </Text>
        <Text textStyle={regularTextStyles}>{sessions}</Text>
        <Text textStyle={{ base: "xSmallMedium", lg: "displaySmallSemiBold" }}>
          {registeredCampers}
        </Text>
      </VStack>
    </Flex>
  );
};

const RegistrationSuccessPage = (): React.ReactElement => {
  // if success, restore campers, camp info, and items

  const location = useLocation();

  const items: CartItem[] = [];

  if (location.pathname === REGISTRATION_CANCEL_PAGE) {
    const checkoutCampId = sessionStorage.getItem(CAMP_ID_SESSION_STORAGE_KEY);
    const checkoutData = sessionStorage.getItem(
      getCheckoutSessionStorageKey(checkoutCampId ?? ""),
    );

    if (checkoutData) {
      sessionStorage.removeItem(
        getCheckoutSessionStorageKey(checkoutCampId ?? ""),
      );
      sessionStorage.setItem(
        getFailedSessionStorageKey(checkoutCampId ?? ""),
        checkoutData,
      );
      return <Redirect to={`${CAMP_REGISTER_BASE}/${checkoutCampId}`} />;
    }
  }

  sessionStorage.clear();

  return (
    <Flex
      direction="column"
      align="center"
      mx={{ sm: "20px", md: "40px", lg: "10vw" }}
      my={{ base: "64px", lg: "10vh" }}
    >
      <Text
        textStyle={{ sm: "xSmallBold", md: "bodyBold", lg: "displayLarge" }}
      >
        Thank you for registering!
      </Text>
      <Text
        mt={{ sm: "6px", md: "32px", lg: "20px" }}
        textStyle={{
          sm: "xSmallMedium",
          md: "xSmallMedium",
          lg: "displayMediumRegular",
        }}
      >
        You should receive a payment receipt in your email with 15 minutes,
        including more details about your registration.
      </Text>
      <Flex
        direction={{ sm: "column", lg: "row" }}
        align={{ base: "center", lg: "flex-start" }}
        justify={{ lg: "space-between" }}
        w="100%"
        mt={{ sm: "32px", md: "32px", lg: "64px" }}
        flexWrap="wrap"
      >
        <VStack align="flex-start" w={{ base: "100%", lg: "35vw" }}>
          <Text color="text.success.100" textStyle={subheadingStyles} mb="20px">
            Registration Information
          </Text>
          <RegistrationInfoCard
            imageSrc="src"
            campName="Waterloo 2022 Photography Camp"
            sessions="Session 1 - Aug 5 to Aug 8\nSession 2 - Aug 12 to Aug 15"
            registeredCampers="Campers registered: John (Age 8) and Jane (Age 4)"
          />
        </VStack>
        <VStack
          align="flex-start"
          w={{ base: "100%", lg: "35vw" }}
          mt={{ base: "32px", lg: "0px" }}
        >
          <Text color="text.success.100" textStyle={subheadingStyles} mb="20px">
            Payment Summary
          </Text>
          <VStack w={{ base: "100%", lg: "35vw" }}>
            {items.map((item) => (
              <HStack justify="space-between" key={item.name}>
                <Text textStyle={regularTextStyles}>{item.name}</Text>
                <Text textStyle={regularTextStyles}>{item.totalPrice}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default RegistrationSuccessPage;
