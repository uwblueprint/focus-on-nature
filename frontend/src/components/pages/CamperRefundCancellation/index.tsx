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
  const [cardsDisabled, setCardsDisabled] = useState<boolean>(false);
  const [refundAmountMap, setRefundAmountMap] = useState<Array<number>>([]);
  const [checkedRefunds, setCheckedRefunds] = useState<Array<boolean>>([]);
  const { id: refundCode } = useParams<{ id: string }>();

  const intializeRefundAmountMap = () => {
    const refundAmounts = [...refundAmountMap]
    refunds.forEach((refund, index) => {
      let charge = 0;
      refund.instances.forEach((instance) => {
        charge +=
          instance.charges.earlyDropoff +
          instance.charges.latePickup +
          instance.charges.camp;
      });
      refundAmounts[index] = charge;
      setRefundAmountMap(refundAmounts);
    });
  };

  useEffect(() => {
    const getRefundInfoById = async (code: string) => {
      let numberOfRefunds = 0;
      try {
        const getRefunds = await CamperAPIClient.getRefundInfo(code);
        numberOfRefunds = getRefunds.length;
        setValidCode(true);
        setRefunds(getRefunds);
        setCampName(getRefunds[0].campName);
        const getDiscountAmount = await CamperAPIClient.getRefundDiscountInfo(
          getRefunds[0].instances[0].chargeId,
        );
        setRefundDiscountAmount(getDiscountAmount);
        const refundAmountMapArray = Array(numberOfRefunds);
        getRefunds.forEach((refund, index) => {
          let charge = 0;
          refund.instances.forEach((instance) => {
            charge +=
              instance.charges.earlyDropoff +
              instance.charges.latePickup +
              instance.charges.camp;
          });
          refundAmountMapArray[index] = charge;
        });
        setRefundAmountMap(refundAmountMapArray);
      } catch {
        toast({
          description: `Unable to retrieve Refund Info.`,
          status: "error",
          duration: 3000,
          variant: "subtle",
        });
      } finally {
        const checkedRefundsArray = Array.from(
          { length: numberOfRefunds },
          () => true,
        );
        setCheckedRefunds(checkedRefundsArray);
        setLoading(false);
      }
    };
    getRefundInfoById(refundCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getTotalRefund = () => {
    if (cardsDisabled) {
      return 0;
    }
    let totalRefund = 0;
    refundAmountMap.forEach((refundAmount) => {
      totalRefund += refundAmount;
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
          {cardsDisabled && (
            <Box pb="15px" mt="-15px">
              <Text color="#E5240B" textStyle="displaySmall" as="i">
                Note: You cannot request a refund within 30 days of the camp’s
                start date. Please contact us at
                <Link
                  textDecoration="underline"
                  href="mailto:camps@focusonnature.ca."
                >
                  {" camps@focusonnature.ca "}
                </Link>
                to manually request a refund.
              </Text>
            </Box>
          )}
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
                  setCardsDisabled={setCardsDisabled}
                  checkedRefunds={checkedRefunds}
                  setCheckedRefunds={setCheckedRefunds}
                  refundAmountMap={refundAmountMap}
                  setRefundAmountMap={setRefundAmountMap}
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
