import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import PaymentSummary from "./PaymentSummary";
import ReviewInformation from "./ReviewInformation";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { CampResponse } from "../../../../../types/CampsTypes";
import { mapCampToCartItems } from "../../../../../utils/RegistrationUtils";

type ReviewRegistrationProps = {
  campers: RegistrantExperienceCamper[];
  camp: CampResponse;
  onPageVisited: () => void;
};

const ReviewRegistration = ({
  campers,
  camp,
  onPageVisited,
}: ReviewRegistrationProps): React.ReactElement => {
  useEffect(() => onPageVisited());
  return (
    <Box>
      <PaymentSummary
        campName={camp.name}
        items={mapCampToCartItems(camp, campers)}
      />

      {/* <ReviewInformation /> */}
    </Box>
  );
};

export default ReviewRegistration;
