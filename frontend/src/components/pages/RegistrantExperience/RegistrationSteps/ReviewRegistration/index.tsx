import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import PaymentSummary from "./PaymentSummary";
import { CartItem } from "../../../../../types/RegistrationTypes";
import EditCamperCard from "./EditCamperCard";
import EditContactCard from "./EditContactCard";
import { CampResponse } from "../../../../../types/CampsTypes";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { usePersonalInfoDispatcher } from "../PersonalInfo/personalInfoReducer";
import GeneralAccordionButton from "../../../../common/GeneralAccordionButton";

const items: CartItem[] = [
  {
    name: "yes1",
    campers: 2,
    totalPrice: 15.5,
    details: "Some sample details",
  },
  {
    name: "yes2",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes3",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes4",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes5",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes6",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes7",
    campers: 2,
    totalPrice: 15.5,
  },
];

type ReviewRegistrationProps = {
  camp: CampResponse;
  campers: RegistrantExperienceCamper[];
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
  reviewSummary: boolean;
};

const ReviewRegistration = ({
  camp,
  campers,
  setCampers,
  reviewSummary,
}: ReviewRegistrationProps): React.ReactElement => {
  const dispatchPersonalInfoAction = usePersonalInfoDispatcher(setCampers);

  return !reviewSummary ? (
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
  ) : (
    <PaymentSummary campName={camp.name} items={items} />
  );
};

export default ReviewRegistration;
