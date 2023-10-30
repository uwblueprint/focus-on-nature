import React from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { DeleteIcon } from "@chakra-ui/icons";
import { Button, Text, useDisclosure, useToast } from "@chakra-ui/react";
import DeleteModal from "../DeleteModal";

type CamperCardDeletionButtonProps = {
  onDeleteCallBack: () => void;
  name: string;
};

function CamperCardDeletionButton({
  onDeleteCallBack,
  name,
}: CamperCardDeletionButtonProps): ReactJSXElement {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteCamperModal = DeleteModal({
    title: "Remove Camper",
    bodyText:
      "Are you sure you want to remove this camper from the registration form?",
    bodyNote: "Note: this action is irreversible.",
    buttonLabel: "Remove",
    isOpen,
    onClose,
    onDelete: () => {
      onDeleteCallBack();
      toast({
        description: `${name} has been successfully removed`,
        status: "success",
        duration: 3000,
        isClosable: false,
        variant: "subtle",
      });
      onClose();
    },
  });

  return (
    <>
      <Button
        color="text.critical.100"
        variant="outline"
        onClick={onOpen}
        colorScheme="blue"
      >
        <DeleteIcon />
        <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }} pl={3}>
          Remove
        </Text>
      </Button>
      {deleteCamperModal}
    </>
  );
}

export default CamperCardDeletionButton;
