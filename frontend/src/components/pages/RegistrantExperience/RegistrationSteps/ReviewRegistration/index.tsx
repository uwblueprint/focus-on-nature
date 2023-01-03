import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import PaymentSummary from "./PaymentSummary";
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

      {/* <ReviewInformation /> */}
    </Box>
  );
};

export default ReviewRegistration;
