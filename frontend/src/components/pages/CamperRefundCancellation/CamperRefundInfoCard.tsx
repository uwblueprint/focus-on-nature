import React from "react";
import {
  Box,
  Text,
  Checkbox,
  VStack,
  StackDivider,
  Flex,
  Spacer,
  extendTheme,
  ChakraProvider,
} from "@chakra-ui/react";
import { CamperRefundDTO, RefundDTO } from "../../../types/CamperTypes";

type CamperRefundInfoCardProps = {
  camperRefund: any;
  firstName: string;
  lastName: string;
  camperNum: number;
  key: number;
  instances: Array<CamperRefundDTO>;
};

const CamperRefundInfoCard = ({
  camperRefund,
  firstName,
  lastName,
  camperNum,
  key,
  instances,
}: CamperRefundInfoCardProps): React.ReactElement => {
  const getTimeDifference = (date1: Date, date2: Date): number => {
    const date1Time = date1.getHours() * 60 + date1.getMinutes();
    const date2Time = date2.getHours() * 60 + date2.getMinutes();

    return date2Time - date1Time; // Difference in minutes
  };

  const getTotalEDLPTime = (instance: CamperRefundDTO): number => {
    const start = camperRefund.startTime;
    const end = camperRefund.endTime;
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);

    const endDate = new Date();
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);

    let total = 0;
    const earlyDropoffs = instance.earlyDropoff;
    const latePickups = instance.latePickup;

    earlyDropoffs?.forEach((date) => {
      total += getTimeDifference(new Date(date), startDate);
    });

    latePickups?.forEach((date) => {
      total += getTimeDifference(endDate, new Date(date));
    });
    return total;
  };

  const getTotalRefundForCamper = () => {
    let totalRefund = 0;
    instances.forEach((instance) => {
      totalRefund +=
        instance.charges.earlyDropoff +
        instance.charges.latePickup +
        instance.charges.camp;
    });
    return totalRefund;
  };

  const isRefundValid = () => {
    const dates: Date[] = [];

    // get all the dates of sessions
    instances.forEach((instance) => {
      instance.dates.forEach((date) => {
        dates.push(new Date(date));
      });
    });

    // sort the dates and find the first session
    dates.sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return new Date().getTime() - firstDate.getTime() >= thirtyDays;
  };

  const valid = isRefundValid();

  const textColor = valid ? "#000000" : "#00000066";

  return (
    <Box
      backgroundColor="background.white.100"
      width="100%"
      borderRadius={10}
      borderColor="gray"
      borderWidth="1.75px"
      marginBottom="32px"
    >
      <Box
        backgroundColor="background.white.100"
        pt="20px"
        pb="12px"
        pr="24px"
        pl="24px"
        borderRadius={10}
      >
        <Checkbox
          isDisabled={!valid}
          defaultChecked={valid}
          colorScheme="green"
          size="lg"
        >
          <Text as="b" fontSize="2xl" marginLeft="5px">
            {" "}
            {firstName} {lastName}{" "}
          </Text>
        </Checkbox>
      </Box>
      <Box
        backgroundColor="#F5F5F5"
        pt="24px"
        pb="32px"
        pl="61px"
        pr="61px"
        borderRadius="0 0 10px 10px"
        width="100%"
      >
        <VStack
          divider={<StackDivider borderColor="gray.300" height="4px" />}
          spacing={7}
          align="stretch"
        >
          <VStack spacing={7}>
            <Flex width="100%">
              <Text as="b" fontSize="xl" color={textColor}>
                Item
              </Text>
              <Spacer />
              <Text as="b" fontSize="xl" color={textColor}>
                Total Price (CAD)
              </Text>
            </Flex>
            <VStack width="100%">
              {instances.map((instance, index) => {
                return (
                  <Flex width="100%" key={index}>
                    <Text fontSize="2xl" color={textColor}>
                      Session {index + 1}
                    </Text>
                    <Spacer />
                    <Text fontSize="2xl" color={textColor}>
                      ${instance.charges.camp}
                    </Text>
                  </Flex>
                );
              })}
            </VStack>
          </VStack>

          <VStack>
            <Flex width="100%">
              <VStack width="100%" spacing={2} align="stretch">
                {instances.map((instance, index) => {
                  return (
                    <>
                      <Flex width="100%" key={index}>
                        <VStack width="50%" alignItems="flex-start">
                          <Text
                            textAlign="left"
                            fontSize="2xl"
                            color={textColor}
                          >
                            Session {index + 1} EDLP
                          </Text>
                          <Text
                            textAlign="left"
                            fontSize={{ lg: "sm", sm: "2xl", md: "2xl" }}
                            color={textColor}
                          >
                            {getTotalEDLPTime(instance)} minutes
                          </Text>
                        </VStack>
                        <Spacer />
                        <Text fontSize="2xl" pt="15px" color={textColor}>
                          $
                          {instance.charges.earlyDropoff +
                            instance.charges.latePickup}
                        </Text>
                      </Flex>
                    </>
                  );
                })}
              </VStack>
            </Flex>
          </VStack>

          <Flex width="100%">
            <Text as="b" fontSize="xl" color={textColor}>
              Total Refund for Camper #{camperNum}
            </Text>
            <Spacer />
            <Text as="b" fontSize="xl" color={textColor}>
              ${getTotalRefundForCamper()}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default CamperRefundInfoCard;
