import React from "react";
import { Button, Flex } from "@chakra-ui/react";

export type WaitlistFooterProps = {
  submitHandler: () => void;
};

const WaitlistFooter = ({
  submitHandler,
}: WaitlistFooterProps): React.ReactElement => {
  return (
    <Flex
      bg="white"
      boxShadow="sm"
      minH="92px"
      width="100vw"
      align="center"
      justify={{ sm: "center", md: "end", lg: "end" }}
      flexWrap="wrap"
      padding="20px"
      position="fixed"
      bottom="0"
    >
      <Button
        width={{ sm: "95vw", md: "50vw", lg: "auto" }}
        height="48px"
        variant="primary"
        onClick={submitHandler}
        mb={{ sm: 4, md: 0 }}
        mr={{ sm: 0, md: 4 }}
      >
        Submit
      </Button>
    </Flex>
  );
};

export default WaitlistFooter;
