import React from "react";
import { Text, Flex, VStack, HStack } from "@chakra-ui/react";
import { CartItem } from "../../../../types/RegistrationTypes";

import { calculateTotalPrice } from "../../../../utils/RegistrationUtils";
import RegistrationInfoCard from "./RegistrationInfoCard";
import {
  cardBoldStyles,
  regularTextStyles,
  resultTextStyles,
  resultTitleStyles,
  subheadingStyles,
} from "./textStyles";
import { CampResponse } from "../../../../types/CampsTypes";
import { CreateCamperRequest } from "../../../../types/CamperTypes";

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

type RegistrationResultProps = {
  camp?: CampResponse;
  campers?: CreateCamperRequest[];
  items?: CartItem[];
};

const RegistrationResult = ({
  camp,
  campers,
  items,
}: RegistrationResultProps): React.ReactElement => {
  return (
    <Flex
      direction="column"
      align="center"
      mx={{ sm: "20px", md: "40px", lg: "10vw" }}
      my={{ base: "64px", lg: "10vh" }}
    >
      {camp && campers && items ? (
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
                campName={camp?.name ?? ""}
                sessions="Session 1 - Aug 5 to Aug 8\nSession 2 - Aug 12 to Aug 15"
                registeredCampers={campers ?? []}
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
              <PaymentSummaryList items={items} />
            </VStack>
          </Flex>
        </>
      ) : (
        <NoSessionDataFound />
      )}
    </Flex>
  );
};

export default RegistrationResult;
