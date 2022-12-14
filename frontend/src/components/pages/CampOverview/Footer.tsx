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

import {
  CampResponse,
  CreateCampSessionRequest,
  CreateFormQuestion,
  CreateUpdateCampRequest,
} from "../../../types/CampsTypes";
import FooterDeleteModal from "./FooterDeleteModal";
import { CAMPS_PAGE, CAMP_EDIT_PAGE } from "../../../constants/Routes";
import { createUpdateCamp } from "../../../utils/CampUtils";

type FooterProps = {
  camp: CampResponse;
};

const Footer = ({ camp }: FooterProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const handlePublish = async () => {
    // Ensure that we are not dealing with a published camp already
    // (should not happen due to conditional rendering, but checking to be sure)
    if (camp.active) {
      return;
    }

    // change formQuestions to CreateFormQuestions
    const newFormQuestions: CreateFormQuestion[] = [];
    camp.formQuestions.forEach((fq) => {
      const newFormQuestion: CreateFormQuestion = {
        type: fq.type,
        required: fq.required,
        question: fq.question,
        options: fq.options,
        description: fq.description,
        category: fq.category,
      };
      newFormQuestions.push({ ...newFormQuestion });
    });

    // change campSessions to CreateCampSessions
    const newCampSessions: CreateCampSessionRequest[] = [];
    camp.campSessions.forEach((cs) => {
      const newCampSession: CreateCampSessionRequest = {
        dates: cs.dates,
        capacity: cs.capacity,
      };
      newCampSessions.push({ ...newCampSession });
    });

    const updateCampFields: CreateUpdateCampRequest = {
      active: true,
      ageLower: camp.ageLower,
      ageUpper: camp.ageUpper,
      campCoordinators: camp.campCoordinators,
      campCounsellors: camp.campCounsellors,
      name: camp.name,
      description: camp.description,
      earlyDropoff: camp.earlyDropoff,
      endTime: camp.endTime,
      latePickup: camp.latePickup,
      location: camp.location,
      startTime: camp.startTime,
      fee: camp.fee,
      pickupFee: camp.pickupFee,
      dropoffFee: camp.dropoffFee,
      formQuestions: newFormQuestions,
      campSessions: newCampSessions,
      volunteers: camp.volunteers,
    };

    const res = await createUpdateCamp(updateCampFields, false, camp.id);

    if (!(res instanceof Error)) {
      history.push(CAMPS_PAGE);
      toast({
        description: `${camp.name} has been successfully published`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
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
