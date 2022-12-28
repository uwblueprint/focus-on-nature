import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../types/CampsTypes";
import CamperQuestionsCard from "./QuestionCards/CamperQuestionsCard";
import EarlyDropOffLatePickupCard from "./QuestionCards/EarlyDropOffLatePickupCard";

type AdditionalInfoProps = {
  toggleChecked: (checked: boolean) => void;
  formQuestions: FormQuestion[];
  campers: RegistrantExperienceCamper[];
  setCampers: (campers: RegistrantExperienceCamper[]) => void;
  campName: string;
  hasEarlyDropOffLatePickup: boolean;
  requireEarlyDropOffLatePickup: boolean | null;
  setRequireEarlyDropOffLatePickup: (
    requireEarlyDropOffLatePickup: boolean,
  ) => void;
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
  const updateCamperFormResponse = (
    index: number,
    formResponses: Map<string, string>,
  ) => {
    const newCampers = [...campers];
    newCampers[index].formResponses = formResponses;
    setCampers(newCampers);
  };

  const [submitClicked, setSubmitClicked] = useState(false);

  let numRequiredQuestions = 0;
  formQuestions.forEach((question) => {
    if (question.required) {
      numRequiredQuestions += 1;
    }
  });

  const allQuestionsAnswered = () => {
    if (requireEarlyDropOffLatePickup === null) {
      return false;
    }

    let error = false;
    campers.forEach((camper) => {
      if (
        camper.formResponses &&
        Object.keys(camper.formResponses).length === numRequiredQuestions
      ) {
        error = true;
      }
    });
    return error;
  };

  useEffect(() => {
    const handleFormSubmit = () => {
      setSubmitClicked(true);
      toggleChecked(allQuestionsAnswered());
    };

    if (nextBtnRef && nextBtnRef.current) {
      nextBtnRef.current.addEventListener("click", handleFormSubmit);
    }

    return () => {
      // Passing the same reference
      if (nextBtnRef && nextBtnRef.current) {
        nextBtnRef.current.removeEventListener("click", handleFormSubmit);
      }
    };
  }, [campers, requireEarlyDropOffLatePickup]);

  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">{`${campName} Registration`}</Text>
      <VStack alignItems="flex-start" spacing={8} marginTop={8}>
        <Text textStyle="displayLarge" textColor="primary.green.100">
          Camper-specific Additional Questions
        </Text>
        {campers.map((camper, index) => (
          <CamperQuestionsCard
            key={index}
            camper={camper}
            formQuestions={formQuestions}
            updateCamperFormResponse={updateCamperFormResponse}
            index={index}
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
