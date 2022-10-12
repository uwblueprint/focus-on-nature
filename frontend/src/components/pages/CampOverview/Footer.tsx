import React from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { CampResponse } from "../../../types/CampsTypes";
import FooterDeleteModal from "./FooterDeleteModal";

type FooterProps = {
  camp: CampResponse;
};

const Footer = ({ camp }: FooterProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      pos="fixed"
      bottom="0"
      width="full"
      marginLeft="-16px"
      bg="background.grey.100"
      padding="16px 40px 16px 40px"
      boxShadow="xs"
    >
      <Button
        size="sm"
        bgColor="secondary.critical.100"
        color="background.white.100"
        p="16px"
        onClick={onOpen}
      >
        Delete camp
      </Button>

      <FooterDeleteModal camp={camp} isOpen={isOpen} onClose={onClose} />

      <Spacer />
      {!camp.active && (
        <ButtonGroup>
          <Button
            size="sm"
            color="primary.green.100"
            borderColor="primary.green.100"
            variant="outline"
            p="16px"
          >
            Edit draft
          </Button>
          <Button
            size="sm"
            bgColor="primary.green.100"
            color="background.white.100"
            p="16px"
          >
            Publish camp
          </Button>
        </ButtonGroup>
      )}
    </Flex>
  );
};

export default Footer;
