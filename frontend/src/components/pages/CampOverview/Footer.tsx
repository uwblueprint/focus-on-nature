import React from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { CampResponse } from "../../../types/CampsTypes";
import FooterDeleteModal from "./FooterDeleteModal";

import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { CAMP_EDIT_PAGE } from "../../../constants/Routes";

type FooterProps = {
  camp: CampResponse;
};

const Footer = ({ camp }: FooterProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const handlePublish = async () => {
    const updatedCamp = camp;
    updatedCamp.active = true;
    const res = await CampsAPIClient.editCampById(camp.id, updatedCamp);
    if (res) {
      toast({
        description: `${camp.name} has been successfully published`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
      history.go(0);
    } else {
      toast({
        description: `An error occurred with publishing ${camp.name}`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
    onClose();
  };

  const onEditCampClick = (campID: string): void => {
    history.push(CAMP_EDIT_PAGE.replace(":id", campID));
  };

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
            onClick={() => onEditCampClick(camp.id)}
          >
            Edit draft
          </Button>
          <Button
            size="sm"
            bgColor="primary.green.100"
            color="background.white.100"
            p="16px"
            onClick={handlePublish}
          >
            Publish camp
          </Button>
        </ButtonGroup>
      )}
    </Flex>
  );
};

export default Footer;
