import React from "react";
import { Text, VStack } from "@chakra-ui/react";

import { RefundDTO } from "../../../types/CamperTypes";
import RefundConfirmationCard from "./RefundConfirmationCard";

type RefundConfirmationProps = {
  refunds: RefundDTO[];
};

const RefundConfirmation = ({
  refunds,
}: RefundConfirmationProps): React.ReactElement => {
  return (
    <>
      <VStack p="64px">
        <Text textStyle="displayXLarge" align="center" pb="12px">
          Thank you for submitting the cancellation request form.
        </Text>
        <Text textStyle="displayMediumRegular" align="center" pb="48px">
          A Focus on Nature admin will confirm that your registration has been
          cancelled via email, and you should receive a refund within a few
          hours.
        </Text>
        <Text textStyle="displayLarge" color="text.green.100" pb="12px">
          Cancellation Information
        </Text>
        <VStack maxWidth="760px">
          {refunds.map((refundObject, refundNum) => {
            return (
              <RefundConfirmationCard
                firstName={refundObject.firstName}
                age={refundObject.age}
                campName={refundObject.campName}
                key={refundNum}
                instances={refundObject.instances}
                campPhotoUrl={refundObject.campPhotoUrl}
              />
            );
          })}
        </VStack>
      </VStack>
    </>
  );
};

export default RefundConfirmation;
