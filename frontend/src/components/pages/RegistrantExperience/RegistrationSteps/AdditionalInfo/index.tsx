import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../types/CampsTypes";
import { useAdditionalInfoDispatcher } from "./additionalInfoReducer";
import CamperQuestionsCard from "./QuestionCards/CamperQuestionsCard";
import EarlyDropOffLatePickupCard from "./QuestionCards/EarlyDropOffLatePickupCard";

type AdditionalInfoProps = {
  toggleChecked: (checked: boolean) => void;
  formQuestions: FormQuestion[];
  campers: RegistrantExperienceCamper[];
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
  campName: string;
  hasEarlyDropOffLatePickup: boolean;
  requireEarlyDropOffLatePickup: boolean | null;
  setRequireEarlyDropOffLatePickup: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
  nextBtnRef: React.RefObject<HTMLButtonElement>;
};

const AdditionalInfo = ({
  toggleChecked,
  formQuestions,
  campers,
  setCampers,
  campName,
  hasEarlyDropOffLatePickup,
  requireEarlyDropOffLatePickup,
  setRequireEarlyDropOffLatePickup,
  nextBtnRef,
}: AdditionalInfoProps): React.ReactElement => {
  const dispatchAdditionalInfoAction = useAdditionalInfoDispatcher(setCampers);

  const [submitClicked, setSubmitClicked] = useState(false);

  const getRequiredQuestions = (): string[] => {
    const requiredQuestions: string[] = [];
    formQuestions.forEach((question) => {
      if (question.required) {
        requiredQuestions.push(question.question);
      }
    });
    return requiredQuestions;
  };

  const allQuestionsAnswered = () => {
    if (requireEarlyDropOffLatePickup === null) {
      return false;
    }
    const requiredQuestions = getRequiredQuestions();
    return campers.every((camper) =>
      requiredQuestions.every((question) =>
        camper.formResponses?.get(question),
      ),
    );
  };

  useEffect(() => {
    let nextBtnRefValue: HTMLButtonElement; // Reference to the next step button

    const handleFormSubmit = () => {
      setSubmitClicked(true);
      toggleChecked(allQuestionsAnswered());
    };

    if (nextBtnRef && nextBtnRef.current) {
      nextBtnRefValue = nextBtnRef.current;
      nextBtnRefValue.addEventListener("click", handleFormSubmit);
    }

    return () => {
      if (nextBtnRefValue) {
        nextBtnRefValue.removeEventListener("click", handleFormSubmit);
      }
    };
  }, [campers, nextBtnRef, requireEarlyDropOffLatePickup]);

  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">{`${campName} Registration`}</Text>
      <VStack alignItems="flex-start" spacing={8} marginTop={8}>
        <Text textStyle="displayLarge" textColor="primary.green.100">
          Camper-specific Additional Questions
        </Text>
        {campers.map((camper, camperIndex) => (
          <CamperQuestionsCard
            key={camperIndex}
            camper={camper}
            formQuestions={formQuestions}
            dispatchAdditionalInfoAction={dispatchAdditionalInfoAction}
            camperIndex={camperIndex}
            submitClicked={submitClicked}
          />
        ))}
        {hasEarlyDropOffLatePickup && (
          <Box width="100%">
            <Divider borderColor="border.secondary.100" mb={6} />
            <Text textStyle="displayLarge" textColor="primary.green.100">
              Camp-specific Additional Questions
            </Text>
            <EarlyDropOffLatePickupCard
              setRequireEarlyDropOffLatePickup={
                setRequireEarlyDropOffLatePickup
              }
              submitClicked={submitClicked}
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AdditionalInfo;
