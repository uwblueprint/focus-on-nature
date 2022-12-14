import React from "react";
import { Box } from "@chakra-ui/react";
import PaymentSummary from "./PaymentSummary";
import { CartItem } from "../../../../types/RegistrationTypes";
import ReviewInformation from "./ReviewInformation";

type ReviewRegistrationProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const items: CartItem[] = [
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
  {
    name: "yes",
    campers: 2,
    totalPrice: 15.5,
  },
];

const ReviewRegistration = ({
  isChecked,
  toggleChecked,
}: ReviewRegistrationProps): React.ReactElement => {
  return (
    <Box>
      <PaymentSummary
        campName="Test camp name with longer name and extra"
        items={items}
      />

      {/* <ReviewInformation /> */}
    </Box>
  );
};

export default ReviewRegistration;
