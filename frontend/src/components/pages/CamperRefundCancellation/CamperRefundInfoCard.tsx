import React from "react";
import {
  Box,
  Text,
  Checkbox,
  VStack,
  StackDivider,
  Flex,
  Spacer,
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
  const getTimeDifference = (date1: Date, date2: Date) : number => {
    const date1Time = date1.getHours() * 60 + date1.getMinutes()
    const date2Time = date2.getHours() * 60 + date2.getMinutes()

    return date2Time - date1Time; // Difference in minutes
  };
  

  const getTotalEDLPTime = () : number => {
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

    let total = 0
    instances.forEach((instance : CamperRefundDTO) => {
      const earlyDropoffs = instance.earlyDropoff
      const latePickups = instance.latePickup
      
      earlyDropoffs?.forEach((date) => {
        total += getTimeDifference(new Date(date), startDate)
      })

      latePickups?.forEach((date) => {
        total += getTimeDifference(endDate, new Date(date))
      })
    })
    return total;
  };

  const getTotalRefundForCamper = () => { 
    let totalRefund = 0; 
    instances.forEach(instance => { 
     totalRefund += instance.charges.earlyDropoff + instance.charges.latePickup + instance.charges.camp
    });
    return totalRefund;
  }

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
        <Checkbox defaultChecked colorScheme="green" size="lg">
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
          spacing={4}
          align="stretch"
        >
          <VStack>
            <Flex width="100%">
              <Text as="b" fontSize="xl">
                Item
              </Text>
              <Spacer />
              <Text as="b" fontSize="xl">
                Total Price (CAD)
              </Text>
            </Flex>
            <VStack width="100%">
              {instances.map((instance, index) => {
                return (
                  <Flex width="100%" key={index} bg="yellow">
                    <Text fontSize="2xl">Session {index+1}</Text>
                    <Spacer />
                    <Text fontSize="2xl">${instance.charges.camp}</Text>
                  </Flex>
                );
              })}
            </VStack>
          </VStack>

          <VStack>
            <Flex width="100%">
              <VStack width="50%" spacing={2} align="stretch">
                {instances.map((instance, index) => {
                  return (
                    <>
                      <Text fontSize="2xl">Session {index+1} EDLP</Text>
                      <Spacer />
                      <Text fontSize="2xl" pt="15px">
                        $
                          {instance.charges.earlyDropoff +
                            instance.charges.latePickup}
                      </Text>
                    </>
                  );
                })}
                <Text fontSize="sm">{getTotalEDLPTime()} minutes</Text>
              </VStack>
            </Flex>
          </VStack>

          <Flex width="100%">
            <Text as="b" fontSize="xl">
              Total Refund for Camper #{camperNum}
            </Text>
            <Spacer />
            <Text as="b" fontSize="xl">
              $
              {getTotalRefundForCamper()}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default CamperRefundInfoCard;
