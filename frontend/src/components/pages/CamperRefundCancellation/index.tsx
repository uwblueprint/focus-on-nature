import React, { useState, useEffect, useMemo } from "react";
import { Text, Image, Box, Flex, Button, Link } from "@chakra-ui/react";

import FONIcon from "../../../assets/fon_icon.svg";
import CamperRefundInfoCard from "./CamperRefundInfoCard"
import CamperRefundFooter from "./CamperRefundFooter";

const requestRefund = () => {
  // todo
};

// /refund/randomStr
// each camper
// Camp ID, camp session, everything outlined
// link to the refund page with each camper. 

const CamperRefundCancellation = (): React.ReactElement => {
  const campName = "Guelph Summer Camp 2022 Camp Cancellation"; // Probably should come from an API later

  return (
    <>
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
            <Box pb="40px">
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
            <CamperRefundInfoCard/>
          </Box>
        </Box>
        <CamperRefundFooter/>
  </>
  );
};

export default CamperRefundCancellation;
