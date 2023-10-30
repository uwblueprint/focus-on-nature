import React from "react";
import { Box, Image, Text, HStack } from "@chakra-ui/react";
import { CamperRefundDTO } from "../../../types/CamperTypes";
import defaultCampImage from "../../../assets/default_camp_image.png";

type RefundConfirmationCardProps = {
  firstName: string;
  age: number;
  campName: string;
  key: number;
  campPhotoUrl?: string;
  instances: Array<CamperRefundDTO>;
};

const RefundConfirmationCard = ({
  firstName,
  age,
  campName,
  key,
  campPhotoUrl,
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
          fallbackSrc={defaultCampImage}
          src={campPhotoUrl}
          alt="Camp image"
          maxW={{ base: "192px", lg: "120px" }}
          maxH={{ base: "192px", lg: "120px" }}
          mb={{ sm: 5, md: 0 }}
          fit="contain"
          p="24px"
        />
        <Box p="24px">
          <Text textStyle="displayMediumBold">{campName}</Text>
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
        </Box>
      </HStack>
    </Box>
  );
};

export default RefundConfirmationCard;
