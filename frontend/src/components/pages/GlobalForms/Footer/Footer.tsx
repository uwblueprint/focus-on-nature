import React from "react";
import {
  Button,
  Container,
  Flex,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";
import WaiverAddSectionModal from "./WaiverAddSectionModal";
import { CreateFormQuestion } from "../../../../types/CampsTypes";
import AddQuestionModal from "../../../common/formQuestions/AddQuestionModal";

type FooterProps = {
  isWaiverFooter: boolean;
  onAddWaiverSectionClick: (newClause: WaiverClause) => void;
  onAddFormQuestionToTemplateClick: (newQuestion: CreateFormQuestion) => void;
};

const Footer = ({
  isWaiverFooter,
  onAddWaiverSectionClick,
  onAddFormQuestionToTemplateClick,
}: FooterProps): JSX.Element => {
  const {
    isOpen: waiverAddSectionIsOpen,
    onOpen: waiverAddSectionOnOpen,
    onClose: waiverAddSectionOnClose,
  } = useDisclosure();

  const {
    isOpen: isAddQuestionOpen,
    onOpen: onAddQuestionOpen,
    onClose: onAddQuestionClose,
  } = useDisclosure();

  const onOpenModal = isWaiverFooter
    ? waiverAddSectionOnOpen
    : onAddQuestionOpen;
  const buttonText = isWaiverFooter ? "+ Add form section" : "+ Add question";

  return (
    <Container pos="fixed">
      <WaiverAddSectionModal
        isOpen={waiverAddSectionIsOpen && isWaiverFooter}
        onClose={waiverAddSectionOnClose}
        onAddWaiverSectionClick={onAddWaiverSectionClick}
      />
      <AddQuestionModal
        isOpen={isAddQuestionOpen}
        onClose={onAddQuestionClose}
        onSave={onAddFormQuestionToTemplateClick}
      />
      <Flex
        pos="fixed"
        bottom="0"
        width="full"
        marginLeft="-16px"
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
          onClick={onOpenModal}
        >
          {buttonText}
        </Button>
      </Flex>
    </Container>
  );
};

export default Footer;
