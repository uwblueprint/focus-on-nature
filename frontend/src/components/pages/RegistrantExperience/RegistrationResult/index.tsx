import React, { useEffect, useState } from "react";
import { Text, Flex, VStack, HStack } from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CAMP_REGISTER_PAGE,
  REGISTRATION_CANCEL_PAGE,
} from "../../../../constants/Routes";
import { CartItem, CheckoutData } from "../../../../types/RegistrationTypes";

import { CAMP_ID_SESSION_STORAGE_KEY } from "../../../../constants/RegistrationConstants";
import {
  calculateTotalPrice,
  getCheckoutSessionStorageKey,
  getFailedSessionStorageKey,
} from "../../../../utils/RegistrationUtils";
import RegistrationInfoCard from "./RegistrationInfoCard";
import {
  cardBoldStyles,
  regularTextStyles,
  resultTextStyles,
  resultTitleStyles,
  subheadingStyles,
} from "./textStyles";

const NoSessionDataFound = (): React.ReactElement => {
  return (
    <>
      <Text textStyle={resultTitleStyles}>No checkout session data found</Text>
      <Text
        mt={{ sm: "6px", md: "32px", lg: "20px" }}
        textStyle={resultTextStyles}
      >
        Cannot load session data. If you expect to see a success message, please
        check your email. You should receive a payment receipt within 15
        minutes, including more details about your registration.
      </Text>
    </>
  );
};

const PaymentSummaryList = ({
  items,
}: {
  items: CartItem[];
}): React.ReactElement => {
  return (
    <VStack w={{ base: "100%", lg: "35vw" }} spacing={10}>
      <VStack w="100%" overflowY="auto" h={{ lg: "35vh" }} spacing={8}>
        {/* TODO switch to sum of EDLP, non-EDLP items */}
        {items.map((item, index) => (
          <HStack w="100%" justify="space-between" key={index}>
            <Text textStyle={regularTextStyles}>{item.name}</Text>
            <Text textStyle={regularTextStyles}>${item.totalPrice}</Text>
          </HStack>
        ))}
      </VStack>
      <HStack w="100%" justify="space-between">
        <Text textStyle={cardBoldStyles}>Total</Text>
        <Text textStyle={cardBoldStyles}>${calculateTotalPrice(items)}</Text>
      </HStack>
    </VStack>
  );
};

const RegistrationSuccessPage = (): React.ReactElement => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | undefined>(
    undefined,
  );

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const checkoutCampId = sessionStorage.getItem(CAMP_ID_SESSION_STORAGE_KEY);

    if (checkoutCampId) {
      const checkoutKey = getCheckoutSessionStorageKey(checkoutCampId);
      const sessionData = sessionStorage.getItem(checkoutKey);

      if (sessionData) {
        setCheckoutData(JSON.parse(sessionData) as CheckoutData);
        sessionStorage.removeItem(checkoutKey);

        if (location.pathname === REGISTRATION_CANCEL_PAGE) {
          // Tells registration page explicitly that there is an existing failed checkout
          // as checkout data in session storage is generic for failure/success
          sessionStorage.setItem(
            getFailedSessionStorageKey(checkoutCampId),
            sessionData,
          );
        }
      }

      if (location.pathname === REGISTRATION_CANCEL_PAGE) {
        history.replace(CAMP_REGISTER_PAGE.replace(":id", checkoutCampId));
      } else {
        sessionStorage.clear();
      }
    }
  }, [checkoutData, location, history]);

  return (
    <Flex
      direction="column"
      align="center"
      mx={{ sm: "20px", md: "40px", lg: "10vw" }}
      my={{ base: "64px", lg: "10vh" }}
    >
      {checkoutData ? (
        <>
          <Text textStyle={resultTitleStyles}>Thank you for registering!</Text>
          <Text
            mt={{ sm: "6px", md: "32px", lg: "20px" }}
            textStyle={resultTextStyles}
          >
            You should receive a payment receipt in your email within 15
            minutes, including more details about your registration.
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
              <Text
                color="text.success.100"
                textStyle={subheadingStyles}
                mb="20px"
              >
                Registration Information
              </Text>
              <RegistrationInfoCard
                imageSrc="src"
                campName={checkoutData.camp?.name ?? ""}
                sessions="Session 1 - Aug 5 to Aug 8\nSession 2 - Aug 12 to Aug 15"
                registeredCampers={checkoutData?.campers ?? []}
              />
            </VStack>
            <VStack
              align="flex-start"
              w={{ base: "100%", lg: "35vw" }}
              mt={{ base: "32px", lg: "0px" }}
            >
              <Text
                color="text.success.100"
                textStyle={subheadingStyles}
                mb="20px"
              >
                Payment Summary
              </Text>
              <PaymentSummaryList items={checkoutData.items} />
            </VStack>
          </Flex>
        </>
      ) : (
        <NoSessionDataFound />
      )}
    </Flex>
  );
};

export default RegistrationSuccessPage;
