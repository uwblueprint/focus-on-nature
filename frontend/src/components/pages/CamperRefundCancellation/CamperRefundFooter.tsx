import React from "react";
import { Flex, Button } from "@chakra-ui/react";

const CamperRefundFooter = (props: any): React.ReactElement => {
  return (
    <Flex
      color="#FFFFFF"
      justify="flex-end"
      position="fixed"
      width="100%"
      height="7%"
      bottom="0"
      alignItems="flex-end"
      backgroundColor="#FFFFFF"
      borderTop="2px solid #EEEFF1"
    >
      <Button
        width="auto"
        height="48px"
        variant="primary"
        background={true ? "primary.green.100" : "primary.green_disabled.100"}
        mr="50px"
        mb="12px"
      >
        Request refund
      </Button>
    </Flex>
  );
};

export default CamperRefundFooter;
