import React from "react";
import { Box, Text, Checkbox } from "@chakra-ui/react";

const CamperRefundInfoCard = (props:any): React.ReactElement => {

  return (
    <Box
      backgroundColor="background.white.100"
      width="100%"
      padding={5}
      borderRadius={10}
      borderColor="gray"
      borderWidth="1.75px"
    >
      <Checkbox defaultChecked></Checkbox>
    </Box>
  );
};

export default CamperRefundInfoCard;