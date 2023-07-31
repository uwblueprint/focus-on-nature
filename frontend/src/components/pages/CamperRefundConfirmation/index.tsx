import React from "react";
import { Text, VStack } from "@chakra-ui/react";

import { RefundDTO } from "../../../types/CamperTypes";
import RefundConfirmationCard from "./RefundConfirmationCard";

const CamperRefundConfirmation = (): React.ReactElement => {
  //   const toast = useToast();
  //   const [refunds, setRefunds] = useState<RefundDTO>([]);
  //   const [campName, setCampName] = useState<string>("");

  //   // The camper-refund-cancellation route will have an id to identify the refund code
  //   const { id: refundCode } = useParams<{ id: string }>();

  //   useEffect(() => {
  //     const getRefundInfoById = async (code: string) => {
  //       const getResponse = await CamperAPIClient.getRefundInfo(code);
  //       if (getResponse) {
  //         setRefunds(getResponse);
  //         setCampName(getResponse[0].campName);
  //       } else {
  //         toast({
  //           description: `Unable to retrieve Refund Info.`,
  //           status: "error",
  //           duration: 3000,
  //           variant: "subtle",
  //         });
  //       }
  //     };
  //     getRefundInfoById(refundCode);
  //   }, [toast]);

  const refunds: RefundDTO = [
    {
      campPhotoUrl:
        "https://storage.googleapis.com/focus-on-nature.appspot.com/02f84e84-578d-4887-af9f-3b64e56834b9?GoogleAccessId=firebase-adminsdk-49yfc%40focus-on-nature.iam.gserviceaccount.com&Expires=1690850787&Signature=NDcK7lMeN3Ft53UP%2F3bVWz2PGw96GU3%2BdJuqExlwCu3r%2BD0tbyLkHeic4nRRt9Ic7gtj7%2BF1QsqUSl8NhhHaoIAtYOFDeQlnRb9wFPMo1V5mj9kfNUk8asuZZAF%2BduWEphjjUAiSbBFBILVhfC2nCPzEyIJjfkWBrhFEQf4GlyZQ0oALYGNvP05c5PvI7XvUPW7oVMCe1kHGvrYPZK5V4gLDudOAPQo2inPBzj46RZAAoIwX5%2B6VVPSrA%2BXTKlJjEFiLPYOlIVKOjygY4T4gRLcZzgbKEmtM1PN6%2FZFi1hOdwZNYZMYh%2Fni2VtUNNfV3Xpcz41YC%2F%2FLNPW7geI6%2BVQ%3D%3D",
      startTime: "5:00",
      endTime: "7:00",
      firstName: "Alice",
      lastName: "Smith",
      age: 9,
      campName: "Banff Camp 2023",
      instances: [
        {
          id: "63b527fed9c42a8fd5ea55e6",
          campSession: "63b01de0c71ee220ef84daee",
          earlyDropoff: [
            new Date(
              "Thu Sep 07 2023 14:30:00 GMT+0000 (Coordinated Universal Time)",
            ),
          ],
          latePickup: [
            new Date(
              "Thu Sep 07 2023 21:30:00 GMT+0000 (Coordinated Universal Time)",
            ),
          ],
          registrationDate: new Date(
            "Wed Jan 04 2023 07:17:18 GMT+0000 (Coordinated Universal Time)",
          ),
          hasPaid: true,
          chargeId:
            "cs_test_b1ynp34YOUVYdI6Fn6Xq1q8Ka2kCgM6TlVoWy1vPbZpiSfTPY0rrDwAtD9",
          charges: {
            camp: 160,
            earlyDropoff: 19,
            latePickup: 19,
          },
          dates: [
            "Thu Sep 07 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Sun Sep 03 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Mon Sep 04 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Tue Sep 05 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
          ],
        },
      ],
    },
    {
      campPhotoUrl: "",
      startTime: "5:00",
      endTime: "7:00",
      firstName: "Bob",
      lastName: "Smith",
      age: 10,
      campName: "Banff Camp 2023",
      instances: [
        {
          id: "63b527fed9c42a8fd5ea55e6",
          campSession: "63b01de0c71ee220ef84daee",
          earlyDropoff: [
            new Date(
              "Thu Sep 07 2023 14:30:00 GMT+0000 (Coordinated Universal Time)",
            ),
          ],
          latePickup: [
            new Date(
              "Thu Sep 07 2023 21:30:00 GMT+0000 (Coordinated Universal Time)",
            ),
          ],
          registrationDate: new Date(
            "Wed Jan 04 2023 07:17:18 GMT+0000 (Coordinated Universal Time)",
          ),
          hasPaid: true,
          chargeId:
            "cs_test_b1ynp34YOUVYdI6Fn6Xq1q8Ka2kCgM6TlVoWy1vPbZpiSfTPY0rrDwAtD9",
          charges: {
            camp: 160,
            earlyDropoff: 19,
            latePickup: 19,
          },
          dates: [
            "Thu Sep 07 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Sun Sep 03 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Mon Sep 04 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Tue Sep 05 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
          ],
        },
        {
          id: "63b527fed9c42a8fd5ea55e6",
          campSession: "63b01de0c71ee220ef84daee",
          earlyDropoff: [
            new Date(
              "Thu Sep 14 2023 14:30:00 GMT+0000 (Coordinated Universal Time)",
            ),
          ],
          latePickup: [
            new Date(
              "Thu Sep 14 2023 21:30:00 GMT+0000 (Coordinated Universal Time)",
            ),
          ],
          registrationDate: new Date(
            "Wed Jan 09 2023 07:17:18 GMT+0000 (Coordinated Universal Time)",
          ),
          hasPaid: true,
          chargeId:
            "cs_test_b1ynp34YOUVYdI6Fn6Xq1q8Ka2kCgM6TlVoWy1vPbZpiSfTPY0rrDwAtD9",
          charges: {
            camp: 160,
            earlyDropoff: 19,
            latePickup: 19,
          },
          dates: [
            "Thu Sep 14 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Sun Sep 10 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Mon Sep 11 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
            "Tue Sep 12 2023 17:00:00 GMT+0000 (Coordinated Universal Time)",
          ],
        },
      ],
    },
  ];

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

export default CamperRefundConfirmation;
