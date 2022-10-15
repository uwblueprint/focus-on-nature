import {
  Button,
  Container,
  Flex,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { WaiverClause } from "../../../types/AdminTypes";
import WaiverAddSectionModal from "./WaiverAddSectionModal";

type FooterProps = {
  isWaiverFooter: boolean;
  updateWaiver: (newClause: WaiverClause) => void;
};

const Footer = ({ isWaiverFooter, updateWaiver }: FooterProps): JSX.Element => {
  const buttonText = isWaiverFooter ? "+ Add form section" : "+ Add question";

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container pos="fixed">
      <WaiverAddSectionModal
        isOpen={isOpen && isWaiverFooter}
        onClose={onClose}
        onSubmit={updateWaiver}
      />
      <Flex
        pos="fixed"
        bottom="0"
        width="full"
        bg="background.grey.100"
        padding="16px 40px 16px 40px"
        boxShadow="xs"
      >
        <Spacer />
        <Button
          size="sm"
          bgColor="primary.green.100"
          color="background.white.100"
          p="16px"
          onClick={() => onOpen()}
        >
          {buttonText}
        </Button>
      </Flex>
    </Container>
  );
};

export default Footer;
