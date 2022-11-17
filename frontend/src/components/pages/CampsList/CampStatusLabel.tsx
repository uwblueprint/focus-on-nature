import React from "react";
import { Container } from "@chakra-ui/react";
import { CampStatus } from "../../../types/CampsTypes";

interface CampStatusLabelProps {
  status: CampStatus;
}

const CampStatusLabel = (props: CampStatusLabelProps): JSX.Element => {
  const { status } = props;

  const getBackgroundColor = () => {
    switch (status) {
      case CampStatus.COMPLETED:
        return "label.red.100";
      case CampStatus.DRAFT:
        return "label.yellow.100";
      case CampStatus.PUBLISHED:
        return "label.green.100";
      default:
        return "";
    }
  };

  const getTextColor = () => {
    switch (status) {
      case CampStatus.COMPLETED:
        return "text.critical.100";
      case CampStatus.DRAFT:
        return "text.warning.100";
      case CampStatus.PUBLISHED:
        return "text.success.100";
      default:
        return "";
    }
  };
  return (
    <Container
      textAlign="center"
      w="125px"
      p="8px"
      background={getBackgroundColor()}
      color={getTextColor()}
      borderRadius="50px"
    >
      {status}
    </Container>
  );
};

export default CampStatusLabel;
