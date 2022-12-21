import React from "react";
import { Box } from "@chakra-ui/react";
import PaymentSummary from "./PaymentSummary";
import { CartItem } from "../../../../types/RegistrationTypes";
import ReviewInformation from "./ReviewInformation";

type ReviewRegistrationProps = {
  isChecked: boolean;
  toggleChecked: () => void;
  campName: string;
};

const items: CartItem[] = [
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
    details: "Some sample details",
  },
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
  },
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
  },
];

const ReviewRegistration = ({
  isChecked,
  toggleChecked,
  campName,
}: ReviewRegistrationProps): React.ReactElement => {
  return (
    <Box>
      <PaymentSummary campName={campName} items={items} />

      {/* <ReviewInformation /> */}
    </Box>
  );
};

export default ReviewRegistration;
