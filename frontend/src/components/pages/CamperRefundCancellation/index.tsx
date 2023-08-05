import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import {
  Text,
  Image,
  Box,
  Flex,
  Link,
  useToast,
  Spinner,
  Center,
  Divider,
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
  const [refunds, setRefunds] = useState<RefundDTO[]>([]);
  const [campName, setCampName] = useState<string>("");
  const [validCode, setValidCode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refundDiscountAmount, setRefundDiscountAmount] = useState<number>(-1);

  // The camper-refund-cancellation route will have an id to identify the refund code
  const { id: refundCode } = useParams<{ id: string }>();

  useEffect(() => {
    const getRefundInfoById = async (code: string) => {
      try {
        const getRefunds = await CamperAPIClient.getRefundInfo(code);
        setValidCode(true);
        setRefunds(getRefunds);
        setCampName(getRefunds[0].campName);
        const getDiscountAmount = await CamperAPIClient.getRefundDiscountInfo(
          getRefunds[0].instances[0].chargeId,
        );
        setRefundDiscountAmount(getDiscountAmount);
      } catch {
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
  });

  const getTotalRefund = () => {
    let totalRefund = 0;
    refunds.forEach((refund) => {
      refund.instances.forEach((instance) => {
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

  if (!validCode) {
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
            <Text
              mt="70px"
              textStyle={{
                sm: "xSmallBold",
                md: "bodyBold",
                lg: "displayXLarge",
              }}
            >
              {campName} Camp Cancellation
            </Text>
            <Text
              color="#10741A"
              mt="16px"
              textStyle={{
                sm: "xSmallMedium",
                md: "xSmallBold",
                lg: "displayLarge",
              }}
            >
              Please select the campers you wish to request a refund for.
            </Text>
            <Text
              mt="16px"
              textStyle={{
                sm: "xSmallRegular",
                md: "xSmallRegular",
                lg: "displayMediumRegular",
              }}
            >
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
          {refundDiscountAmount > 0 && (
            <>
              <Box>
                <Flex width="100%" justifyContent="space-between">
                  <Text textStyle="displayMediumBold">Refund Amount</Text>
                  <Text textStyle="displayMediumBold">${getTotalRefund()}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" py="10px">
                  <Text textStyle="captionSemiBold">Discount</Text>
                  <Text textStyle="captionSemiBold">
                    -${refundDiscountAmount}
                  </Text>
                </Flex>
              </Box>
              <Divider borderColor="gray.500" height="4px" />
            </>
          )}

          {refundDiscountAmount === 0 ? (
            <Flex width="100%" justifyContent="space-between">
              <Text
                textStyle={{
                  sm: "xSmallBold",
                  md: "captionSemiBold",
                  lg: "displayMediumBold",
                }}
              >
                Total Refund
              </Text>
              <Text
                textStyle={{
                  sm: "xSmallBold",
                  md: "captionSemiBold",
                  lg: "displayMediumBold",
                }}
                py="10px"
              >
                ${getTotalRefund() - refundDiscountAmount}
              </Text>
            </Flex>
          ) : (
            <Flex width="100%" justifyContent="right">
              <Text
                textStyle={{
                  sm: "xSmallBold",
                  md: "captionSemiBold",
                  lg: "displayMediumBold",
                }}
                py="10px"
              >
                ${getTotalRefund() - refundDiscountAmount}
              </Text>
            </Flex>
          )}
        </Box>
      </Box>
      <CamperRefundFooter />
    </>
  );
};

export default CamperRefundCancellation;
