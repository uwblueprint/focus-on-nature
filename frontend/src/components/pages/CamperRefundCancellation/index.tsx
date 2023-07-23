import React, { useState, useEffect, useMemo } from "react";
import { useParams, Redirect } from "react-router-dom";
import {
  Text,
  Image,
  Box,
  Flex,
  Button,
  Link,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";

import FONIcon from "../../../assets/fon_icon.svg";
import CamperRefundInfoCard from "./CamperRefundInfoCard";
import CamperRefundFooter from "./CamperRefundFooter";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";
import { RefundDTO } from "../../../types/CamperTypes";
import { HOME_PAGE } from "../../../constants/Routes";

// /refund/randomStr
// each camper
// Camp ID, camp session, everything outlined
// link to the refund page with each camper.

const CamperRefundCancellation = (): React.ReactElement => {
  const toast = useToast();
  const [refunds, setRefunds] = useState<RefundDTO>([]);
  const [campName, setCampName] = useState<string>("");
  const [validCode, setValidCode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // The camper-refund-cancellation route will have an id to identify the refund code
  const { id: refundCode } = useParams<{ id: string }>();

  useEffect(() => {
    const getRefundInfoById = async (code: string) => {
      try {
        const getResponse = await CamperAPIClient.getRefundInfo(code);
        setValidCode(true);
        setRefunds(getResponse);
        setCampName(getResponse[0].campName);
      } catch {
        setValidCode(false);
        toast({
          description: `Unable to retrieve Refund Info.`,
          status: "error",
          duration: 3000,
          variant: "subtle",
        });
      } finally {
        setLoading(false);
      }
    };
    getRefundInfoById(refundCode);
  }, []);

  const getTotalRefund = () => {
    let totalRefund = 0;
    refunds.forEach((refund, i) => {
      refund.instances.forEach((instance, j) => {
        totalRefund +=
          instance.charges.earlyDropoff +
          instance.charges.latePickup +
          instance.charges.camp;
      });
    });
    return totalRefund;
  };

  if (loading) {
    return (
      <Center p="30px">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (validCode === false) {
    return <Redirect to={HOME_PAGE} />;
  }

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
            <Text as="b" mt="70px" textStyle={{ sm: "xSmallBold", md: "bodyBold", lg: "displayXLarge" }} >
              {campName} Camp Cancellation
            </Text>
            <Text color="#10741A" mt="16px" textStyle={{ sm: "xSmallMedium", md: "xSmallBold", lg: "displayLarge" }}> 
              Please select the campers you wish to request a refund for.
            </Text>
            <Text mt="16px" textStyle={{ sm: "xSmallRegular", md: "xSmallRegular", lg: "displayMediumRegular" }}>
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
          <Box pb="20px">
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
          <Flex width="100%" justifyContent="space-between">
            <Text as="b" textStyle={{ sm: "xSmallBold", md: "captionSemiBold", lg: "displayMediumBold" }}>
              Total Refund
            </Text>
            <Text as="b" textStyle={{ sm: "xSmallBold", md: "captionSemiBold", lg: "displayMediumBold" }}>
              ${getTotalRefund()}
            </Text>
          </Flex>
        </Box>
      </Box>
      <CamperRefundFooter />
    </>
  );
};

export default CamperRefundCancellation;
