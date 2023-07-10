import React from "react";
import { Box, Image, Text, HStack } from "@chakra-ui/react";
import { CamperRefundDTO } from "../../../types/CamperTypes";

type RefundConfirmationCardProps = {
  firstName: string;
  age: number;
  campName: string;
  key: number;
  instances: Array<CamperRefundDTO>;
};

const RefundConfirmationCard = ({
  firstName,
  age,
  campName,
  key,
  instances,
}: RefundConfirmationCardProps): React.ReactElement => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  return (
    <Box
      backgroundColor="background.grey.200"
      width="100%"
      borderRadius={10}
      borderColor="border.grey.100"
      borderWidth="1px"
      marginBottom="32px"
      key={key}
    >
      <HStack>
        <Image
          objectFit="scale-down"
          src="https://cdn.britannica.com/55/174255-050-526314B6/brown-Guernsey-cow.jpg?w=400&h=300&c=crop"
          alt="Camp Image"
          width="20%"
          p="24px"
        />
        <Box p="24px">
          <Text as="b" textStyle="displayMediumBold">
            {campName}
          </Text>
          {instances.map((instance, index) => {
            const date1 = new Date(instance.dates[0]);
            const date2 = new Date(instance.dates[1]);
            return (
              <>
                <Text key="index" textStyle="displaySmallRegular">
                  Session {index + 1} -{" "}
                  {date1.toLocaleDateString("en-US", dateOptions)} -{" "}
                  {date2.toLocaleDateString("en-US", dateOptions)}
                </Text>
              </>
            );
          })}
          <Text textStyle="displaySmallSemiBold">
            Camper name: {firstName} (Age {age})
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default RefundConfirmationCard;
