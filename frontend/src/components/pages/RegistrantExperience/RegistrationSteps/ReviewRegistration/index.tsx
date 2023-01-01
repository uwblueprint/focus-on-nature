import React, { useEffect } from "react";
import PaymentSummary from "./PaymentSummary";
import ReviewInformation from "./ReviewInformation";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { CampResponse, CampSession } from "../../../../../types/CampsTypes";
import { mapCampToCartItems } from "../../../../../utils/RegistrationUtils";
import { EdlpChoice } from "../../../../../types/RegistrationTypes";

type ReviewRegistrationProps = {
  campers: RegistrantExperienceCamper[];
  sessions: CampSession[];
  camp: CampResponse;
  edlpChoices: EdlpChoice[][];
  onPageVisited: () => void;
};

const ReviewRegistration = ({
  campers,
  sessions,
  camp,
  edlpChoices,
  onPageVisited,
}: ReviewRegistrationProps): React.ReactElement => {
  useEffect(() => onPageVisited());
  return (
    <Box>
      <PaymentSummary
        campName={camp.name}
        items={mapCampToCartItems(camp, sessions, campers, edlpChoices)}
      />

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
