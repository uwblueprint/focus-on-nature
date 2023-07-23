import React from "react";
import { Flex, Button } from "@chakra-ui/react";

const CamperRefundFooter = (props: any): React.ReactElement => {
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
      pr={{ sm:"12%", md:"12%", lg:"80px" }}
      pb="24px"
      pl="12%"
    >

      <Button
        width={{ sm: "100vw", md: "auto", lg: "auto" }}
        height="48px"
        variant="primary"
        background={true ? "primary.green.100" : "primary.green_disabled.100"}
        textStyle="buttonSemiBold"
        pt="12px"
        pr="25px"
        pb="12px"
        pl="25px"
      >
        Request refund
      </Button>
    </Flex>
  );
};

export default CamperRefundFooter;
