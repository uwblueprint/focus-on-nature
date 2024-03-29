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
  hasEDLP: boolean;
  requireEDLP: boolean | null;
  setRequireEDLP: React.Dispatch<React.SetStateAction<boolean | null>>;
  setEdlpSelections: React.Dispatch<React.SetStateAction<EdlpSelections>>;
  isEditing: number;
  setIsEditing: React.Dispatch<React.SetStateAction<number>>;
};

const ReviewRegistration = ({
  campers,
  sessions,
  camp,
  edlpSelections,
  onPageVisited,
  setCampers,
  isPaymentSummary,
  hasEDLP,
  requireEDLP,
  setRequireEDLP,
  setEdlpSelections,
  isEditing,
  setIsEditing,
}: ReviewRegistrationProps): React.ReactElement => {
  useEffect(onPageVisited);
  return !isPaymentSummary ? (
    <ReviewInformation
      camp={camp}
      campers={campers}
      setCampers={setCampers}
      hasEDLP={hasEDLP}
      requireEDLP={requireEDLP}
      setRequireEDLP={setRequireEDLP}
      selectedSessions={sessions}
      edlpSelections={edlpSelections}
      setEdlpSelections={setEdlpSelections}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  ) : (
    <PaymentSummary
      campName={camp.name}
      items={mapCampToCartItems(camp, sessions, campers, edlpSelections)}
    />
  );
};

export default ReviewRegistration;
