import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { CampResponse } from "../../../types/CampsTypes";
import { CAMPS_PAGE } from "../../../constants/Routes";

import CampsAPIClient from "../../../APIClients/CampsAPIClient";

type FooterDeleteModalProps = {
  camp: CampResponse;
  isOpen: boolean;
  onClose: () => void;
};

const FooterDeleteModal = ({
  camp,
  isOpen,
  onClose,
}: FooterDeleteModalProps): JSX.Element => {
  const [redirect, setRedirect] = useState<boolean>(false);
  const [isAwaitingReq, setIsAwaitingReq] = React.useState(false);

  const toast = useToast();

  const handleDeleteCamp = async () => {
    setIsAwaitingReq(true);
    const res = await CampsAPIClient.deleteCamp(camp.id);
    setIsAwaitingReq(false);
    if (res) {
      toast({
        description: `${camp.name} has been successfully deleted`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
      setRedirect(true);
    } else {
      toast({
        description: `An error occurred with deleting ${camp.name}`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered preserveScrollBarGap>
      <ModalOverlay />
      <ModalContent>
        {redirect && (
          <Redirect
            to={{
              pathname: CAMPS_PAGE,
            }}
          />
        )}
        <ModalHeader>Delete {camp.name}</ModalHeader>
        <ModalBody>
          {`Are you sure you want to delete ${camp.name}?`}
          <br />
          <br />
          <Text as="b">Note: this action is irreversible.</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            size="sm"
            bgColor="background.grey.100"
            color="text.default.100"
            mr={3}
            p="16px"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            bgColor="secondary.critical.100"
            color="background.white.100"
            p="16px"
            onClick={handleDeleteCamp}
            isLoading={isAwaitingReq}
          >
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FooterDeleteModal;
