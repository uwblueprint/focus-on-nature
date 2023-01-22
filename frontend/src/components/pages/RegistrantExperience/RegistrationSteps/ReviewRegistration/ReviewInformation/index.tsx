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
import EditAdditionalQuestionsCard from "./EditAdditionalQuestionsCard";
import { CampResponse } from "../../../../../../types/CampsTypes";
import { RegistrantExperienceCamper } from "../../../../../../types/CamperTypes";
import { usePersonalInfoDispatcher } from "../../PersonalInfo/personalInfoReducer";
import { useAdditionalInfoDispatcher } from "../../AdditionalInfo/additionalInfoReducer";
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
  const dispatchAdditionalInfoAction = useAdditionalInfoDispatcher(setCampers);

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
                personalInfoQuestions={camp.formQuestions.filter(
                  (q) => q.category === "PersonalInfo",
                )}
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
                camper={campers[0]}
                contact={contact}
                contactIndex={index}
                dispatchPersonalInfoAction={dispatchPersonalInfoAction}
                emergencyContactQuestions={camp.formQuestions.filter(
                  (q) => q.category === "EmergencyContact",
                )}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none" mb={4}>
          <GeneralAccordionButton title="Additional Information" />
          <AccordionPanel pb={4}>
            {campers.map((camper, camperIndex) => (
              <EditAdditionalQuestionsCard
                key={camperIndex}
                camper={camper}
                camperIndex={camperIndex}
                campSpecificFormQuestions={camp.formQuestions.filter(
                  (question) => question.category === "CampSpecific",
                )}
                dispatchAdditionalInfoAction={dispatchAdditionalInfoAction}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default ReviewInformation;
