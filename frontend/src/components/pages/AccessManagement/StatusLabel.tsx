import { Container, Text } from "@chakra-ui/react";
import React from "react";
import { StatusLabelProps } from "../../../types/AccessManagementTypes";

const StatusLabel = (props: StatusLabelProps) => {
  const { active, value } = props;
  return (
    <Container
      textAlign="center"
      w="125px"
      p="8px"
      background={active ? "label.green.100" : "label.red.100"}
      color={active ? "text.success.100" : "text.critical.100"}
      borderRadius="50px"
    >
      {value}
    </Container>
  );
};

export default StatusLabel;
