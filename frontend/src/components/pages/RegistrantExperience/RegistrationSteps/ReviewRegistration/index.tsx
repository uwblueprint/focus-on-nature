import React, { useEffect } from "react";
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
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
  isPaymentSummary: boolean;
};

const ReviewRegistration = ({
  campers,
  sessions,
  camp,
  edlpChoices,
  onPageVisited,
  setCampers,
  isPaymentSummary,
}: ReviewRegistrationProps): React.ReactElement => {
  useEffect(onPageVisited);
  return !isPaymentSummary ? (
    <ReviewInformation camp={camp} campers={campers} setCampers={setCampers} />
  ) : (
    <PaymentSummary
      campName={camp.name}
      items={mapCampToCartItems(camp, sessions, campers, edlpChoices)}
    />
  );
};

export default ReviewRegistration;
