import React from "react";
import { Flex, Button } from "@chakra-ui/react";

type CamperRefundFooterProps = {
  isDisabled: boolean;
};

const CamperRefundFooter = ({
  isDisabled,
}: CamperRefundFooterProps): React.ReactElement => {
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
        disabled={isDisabled}
        py="12px"
        px="25px"
      >
        Request refund
      </Button>
    </Flex>
  );
};

export default CamperRefundFooter;
