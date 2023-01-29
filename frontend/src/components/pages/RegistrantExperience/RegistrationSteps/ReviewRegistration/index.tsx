import React, { useEffect } from "react";
import PaymentSummary from "./PaymentSummary";
import ReviewInformation from "./ReviewInformation";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { CampResponse, CampSession } from "../../../../../types/CampsTypes";
import { mapCampToCartItems } from "../../../../../utils/RegistrationUtils";
import { EdlpSelections } from "../../../../../types/RegistrationTypes";

type ReviewRegistrationProps = {
  campers: RegistrantExperienceCamper[];
  sessions: CampSession[];
  camp: CampResponse;
  edlpSelections: EdlpSelections;
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
  edlpSelections,
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
      items={mapCampToCartItems(camp, sessions, campers, edlpSelections)}
    />
  );
};

export default ReviewRegistration;
