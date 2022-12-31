import React from "react";
import PaymentSummary from "./PaymentSummary";
import ReviewInformation from "./ReviewInformation";
import { CartItem } from "../../../../../types/RegistrationTypes";
import { CampResponse } from "../../../../../types/CampsTypes";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";

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
  isPaymentSummary: boolean;
};

const ReviewRegistration = ({
  camp,
  campers,
  setCampers,
  isPaymentSummary,
}: ReviewRegistrationProps): React.ReactElement => {
  return !isPaymentSummary ? (
    <ReviewInformation camp={camp} campers={campers} setCampers={setCampers} />
  ) : (
    <PaymentSummary campName={camp.name} items={items} />
  );
};

export default ReviewRegistration;
