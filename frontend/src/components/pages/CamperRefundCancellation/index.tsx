import React, { useState, useEffect, useMemo } from "react";
import { Text, Image, Box, Flex, Button, Link } from "@chakra-ui/react";

import FONIcon from "../../../assets/fon_icon.svg";

const requestRefund = () => {
  // todo
};

const CamperRefundCancellation = (): React.ReactElement => {
  const campName = "Guelph Summer Camp 2022 Camp Cancellation"; // Probably should come from an API later

  return (
    <Box>
      <Image
        src={FONIcon}
        alt="FON icon"
        display="inline"
        width="40px"
        height="40px"
        ml="40px"
        mt="10px"
      />
      <Box pr="12%" pl="12%" pt="5%">
        <Box>
          <Text as="b" mt="70px" fontSize="40px">
            {campName}
          </Text>
          <Text color="#10741A" mt="16px" fontSize="20px">
            Please select the campers you wish to request a refund for.
          </Text>
          <Text mt="16px" fontSize="20px">
            {
              "This form can only be used if you want to get a full refund for each camper. For other circumstances, please contact Focus on Nature via "
            }
            <Link
              textDecoration="underline"
              href="mailto:camps@focusonnature.ca."
            >
              camps@focusonnature.ca
            </Link>
          </Text>
        </Box>
          <Flex
            color="#FFFFFF"
            justify="flex-end"
            position="fixed"
            width="70%"
            bottom="50"
            alignItems="flex-end"
          >
            <Button
              width="auto"
              height="48px"
              variant="primary"
              onClick={requestRefund}
              background={
                true ? "primary.green.100" : "primary.green_disabled.100"
              }
            >
              Request refund
            </Button>
            {/* <Button
              width="auto"
              height="48px"
              variant="primary"
              onClick={requestRefund}
              background={
                true ? "primary.green.100" : "primary.green_disabled.100"
              }
            >
              Rtestdj
            </Button> */}
          </Flex>
        </Box>
    </Box>
  );
};

export default CamperRefundCancellation;
