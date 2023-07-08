import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Text,
  Image,
  Box,
  Flex,
  Button,
  Link,
  useToast,
} from "@chakra-ui/react";

import FONIcon from "../../../assets/fon_icon.svg";
import CamperRefundInfoCard from "./CamperRefundInfoCard";
import CamperRefundFooter from "./CamperRefundFooter";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";
import { RefundDTO } from "../../../types/CamperTypes";

// /refund/randomStr
// each camper
// Camp ID, camp session, everything outlined
// link to the refund page with each camper.

const CamperRefundCancellation = (): React.ReactElement => {
  const toast = useToast();
  const [refunds, setRefunds] = useState<RefundDTO>([]);
  const [campName, setCampName] = useState<string>("");

  // The camper-refund-cancellation route will have an id to identify the refund code
  const { id: refundCode } = useParams<{ id: string }>();

  useEffect(() => {
    const getRefundInfoById = async (code: string) => {
      const getResponse = await CamperAPIClient.getRefundInfo(code);
      if (getResponse) {
        setRefunds(getResponse);
        setCampName(getResponse[0].campName);
      } else {
        toast({
          description: `Unable to retrieve Refund Info.`,
          status: "error",
          duration: 3000,
          variant: "subtle",
        });
      }
    };
    getRefundInfoById(refundCode);
  }, [toast]);

  return (
    <>
      <Box pb="7%">
        <Image
          src={FONIcon}
          alt="FON icon"
          display="inline"
          width="40px"
          height="40px"
          ml="40px"
          mt="10px"
        />
        <Box pr={{ lg: "30%", sm: "12%", md: "12%" }} pl="12%" pt="5%">
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
          <Box>
            {refunds.map((refundObject, refundNum) => {
              return (
                <CamperRefundInfoCard
                  camperRefund={refundObject}
                  firstName={refundObject.firstName}
                  lastName={refundObject.lastName}
                  instances={refundObject.instances}
                  key={refundNum}
                  camperNum={refundNum + 1}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
      <CamperRefundFooter />
    </>
  );
};

export default CamperRefundCancellation;