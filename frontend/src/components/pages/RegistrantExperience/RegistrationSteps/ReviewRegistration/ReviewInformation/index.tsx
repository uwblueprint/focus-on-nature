import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import EditCamperCard from "./EditCamperCard";
import EditContactCard from "./EditContactCard";
import { CampResponse } from "../../../../../../types/CampsTypes";
import { RegistrantExperienceCamper } from "../../../../../../types/CamperTypes";
import { usePersonalInfoDispatcher } from "../../PersonalInfo/personalInfoReducer";
import GeneralAccordionButton from "../../../../../common/GeneralAccordionButton";

type ReviewInformationProps = {
  camp: CampResponse;
  campers: RegistrantExperienceCamper[];
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
};

const ReviewInformation = ({
  camp,
  campers,
  setCampers,
}: ReviewInformationProps): React.ReactElement => {
  const dispatchPersonalInfoAction = usePersonalInfoDispatcher(setCampers);

  return (
    <Box>
      <Text
        textStyle={{ sm: "xSmallBold", md: "bodyBold", lg: "displayXLarge" }}
        mb={4}
      >
        {camp.name} Registration
      </Text>
      <Text
        textStyle={{
          sm: "xSmallMedium",
          md: "xSmallBold",
          lg: "displayLarge",
        }}
        color="primary.green.100"
        mb={{ sm: 4, md: 4, lg: 6 }}
      >
        Review Information
      </Text>

      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem border="none" mb={4}>
          <GeneralAccordionButton title="Camper Information" />
          <AccordionPanel pb={4}>
            {campers.map((camper, index) => (
              <EditCamperCard
                key={index}
                camp={camp}
                camper={camper}
                camperIndex={index}
                dispatchPersonalInfoAction={dispatchPersonalInfoAction}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none" mb={4}>
          <GeneralAccordionButton title="Contact Information" />
          <AccordionPanel pb={4}>
            {campers[0].contacts.map((contact, index) => (
              <EditContactCard
                key={index}
                contact={contact}
                contactIndex={index}
                dispatchPersonalInfoAction={dispatchPersonalInfoAction}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default ReviewInformation;
