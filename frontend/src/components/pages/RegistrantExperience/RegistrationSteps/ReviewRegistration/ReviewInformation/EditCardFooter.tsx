import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import DeleteModal from "../../../../../common/DeleteModal";

type EditCardFooterProps = {
  onDelete: () => void;
  updateFormErrorMsgs: () => void;
};

const EditCardFooter = ({
  onDelete,
  updateFormErrorMsgs,
}: EditCardFooterProps): React.ReactElement => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteAndClose = () => {
    onDelete();
    toast({
      description: `Edits have been discarded.`,
      status: "success",
      duration: 3000,
      isClosable: false,
      variant: "subtle",
    });
    onClose();
  };

  const deleteCamperModal = DeleteModal({
    title: "Discard Edits",
    bodyText: "Are you sure you want to discard all edits?",
    bodyNote: "Note: this action is irreversible.",
    buttonLabel: "Discard Edits",
    isOpen,
    onClose,
    onDelete: deleteAndClose,
  });

  return (
    <Box rounded="xl">
      <Wrap>
        <Spacer />
        <WrapItem>
          <Heading textStyle="displayLarge">
            <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
              <Spacer />
              <Button
                variant="primary"
                textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                w={{ sm: "80px", lg: "200px" }}
                mr={4}
                h={{ sm: "30px", lg: "40px" }}
                onClick={updateFormErrorMsgs}
              >
                Save
              </Button>

              <Button
                color="text.critical.100"
                variant="outline"
                onClick={onOpen}
                colorScheme="red"
                w={{ sm: "80px", lg: "100px" }}
                h={{ sm: "30px", lg: "40px" }}
              >
                <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
                  Cancel
                </Text>
              </Button>
              {deleteCamperModal}
            </Flex>
          </Heading>
        </WrapItem>
      </Wrap>
    </Box>
  );
};

export default EditCardFooter;
