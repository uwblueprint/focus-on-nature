import React from "react";
import { Flex, Button, useToast } from "@chakra-ui/react";
import { RefundDTO } from "../../../types/CamperTypes";
import CamperAPIClient from "../../../APIClients/CamperAPIClient";

type CamperRefundFooterProps = {
  refunds: Array<RefundDTO>;
  checkedRefunds: Array<boolean>;
  refundCode: string;
  setRefunds: React.Dispatch<React.SetStateAction<RefundDTO[]>>;
};

const CamperRefundFooter = ({
  refunds,
  checkedRefunds,
  refundCode,
  setRefunds,
}: CamperRefundFooterProps): React.ReactElement => {
  const toast = useToast();
  const sendData = async (code: string) => {
    const selectedRefunds: Array<RefundDTO> = [];
    checkedRefunds.forEach((checked, i) => {
      if (checked) {
        selectedRefunds.push(refunds[i]);
      }
    });
    try {
      const response = await CamperAPIClient.sendSelectedRefundInfo(
        code,
        selectedRefunds,
      );
      setRefunds(refunds); // TODO: change this to response once the endpoint is implemented
    } catch {
      toast({
        description: `Unable to process selected refunds.`,
        status: "error",
        duration: 3000,
        variant: "subtle",
      });
    }
  };

  return (
    <Flex
      color="#FFFFFF"
      justify="flex-end"
      position="fixed"
      width="100%"
      height="96px"
      bottom="0"
      alignItems="center"
      backgroundColor="#FFFFFF"
      borderTop="2px solid #EEEFF1"
      pt="24px"
      pr={{ sm: "12%", md: "12%", lg: "80px" }}
      pb="24px"
      pl="12%"
    >
      <Button
        width={{ sm: "100vw", md: "auto", lg: "auto" }}
        height="48px"
        variant="primary"
        background="primary.green.100"
        textStyle="buttonSemiBold"
        onClick={() => sendData(refundCode)}
        py="12px"
        px="25px"
      >
        Request refund
      </Button>
    </Flex>
  );
};

export default CamperRefundFooter;
