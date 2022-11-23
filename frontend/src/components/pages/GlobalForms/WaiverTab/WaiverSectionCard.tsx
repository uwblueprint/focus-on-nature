import React from "react";
import {
  Text,
  Box,
  Flex,
  HStack,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";
import EditWaiverModal from "./EditWaiverModal";
import DeleteWaiverModal from "./DeleteWaiverModal";
import RequiredTag from "../../../common/camps/RequiredTag";

interface WaiverSectionCardProps {
  clauseIdx: number;
  clauseData: WaiverClause;
  onEditWaiverSection: (clause: WaiverClause, clauseIdx: number) => void;
  onDeleteWaiverSection: (idx: number) => void;
}
const WaiverSectionCard = ({
  clauseIdx,
  clauseData,
  onEditWaiverSection,
  onDeleteWaiverSection,
}: WaiverSectionCardProps): JSX.Element => {
  function getSectionTitle(number: number) {
    const code = "A".charCodeAt(0);
    return `Section ${String.fromCharCode(code + number)}`;
  }

  const {
    isOpen: editModalIsOpen,
    onOpen: editModalOnOpen,
    onClose: editModalOnClose,
  } = useDisclosure();

  const {
    isOpen: deleteModalIsOpen,
    onOpen: deleteModalOnOpen,
    onClose: deleteModalOnClose,
  } = useDisclosure();

  return (
    <>
      <Box px="32px" pt="20px" pb="22px" bg="background.grey.100" my="12px">
        <Flex pb="14px">
          <HStack spacing="20px">
            <Text textStyle="displaySmallSemiBold">
              {getSectionTitle(clauseIdx)}
            </Text>
            {clauseData.required && <RequiredTag />}
          </HStack>
          <Spacer />
          <HStack spacing="20px">
            <Text
              textStyle="buttonSemiBold"
              _hover={{ cursor: "pointer" }}
              onClick={editModalOnOpen}
              color="text.success.100"
            >
              Edit
            </Text>
            <Text
              textStyle="buttonSemiBold"
              _hover={{ cursor: "pointer" }}
              onClick={deleteModalOnOpen}
              color="text.critical.100"
            >
              Delete
            </Text>
          </HStack>
        </Flex>
        <Text>{clauseData.text}</Text>
      </Box>
      <EditWaiverModal
        clauseData={clauseData}
        clauseIdx={clauseIdx}
        onEditModalClose={editModalOnClose}
        onEditWaiverSection={onEditWaiverSection}
        editModalIsOpen={editModalIsOpen}
      />
      <DeleteWaiverModal
        deleteModalIsOpen={deleteModalIsOpen}
        clauseIdx={clauseIdx}
        onDeleteModalClose={deleteModalOnClose}
        onDeleteWaiverSection={onDeleteWaiverSection}
      />
    </>
  );
};

export default WaiverSectionCard;
