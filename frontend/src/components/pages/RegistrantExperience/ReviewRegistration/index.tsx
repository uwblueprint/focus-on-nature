import React from "react";
import { Box } from "@chakra-ui/react";
import PaymentSummary from "./PaymentSummary";
import ReviewInformation from "./ReviewInformation";
import { CreateCamperRequest } from "../../../../types/CamperTypes";
import { CampResponse } from "../../../../types/CampsTypes";
import { mapToCampItems } from "../../../../utils/RegistrationUtils";

type ReviewRegistrationProps = {
  campers: CreateCamperRequest[];
  camp: CampResponse;
};

const ReviewRegistration = ({
  campers,
  camp,
}: ReviewRegistrationProps): React.ReactElement => {
  return (
    <Box>
      <PaymentSummary
        campName={camp.name}
        items={mapToCampItems(campers, camp)}
      />

      {/* <ReviewInformation /> */}
    </Box>
  );
};

export default ReviewRegistration;
