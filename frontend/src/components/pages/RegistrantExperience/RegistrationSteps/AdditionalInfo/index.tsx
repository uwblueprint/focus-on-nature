import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { FormQuestion } from "../../../../../types/CampsTypes";
import { useAdditionalInfoDispatcher } from "./additionalInfoReducer";
import CamperQuestionsCard from "./QuestionCards/CamperQuestionsCard";
import EarlyDropOffLatePickupCard from "./QuestionCards/EarlyDropOffLatePickupCard";

type AdditionalInfoProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  campers: RegistrantExperienceCamper[];
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
  campName: string;
  campSpecificFormQuestions: FormQuestion[];
  hasEDLP: boolean;
  requireEDLP: boolean | null;
  setRequireEDLP: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const AdditionalInfo = ({
  nextBtnRef,
  campers,
  setCampers,
  campName,
  campSpecificFormQuestions,
  hasEDLP,
  requireEDLP,
  setRequireEDLP,
}: AdditionalInfoProps): React.ReactElement => {
  const dispatchAdditionalInfoAction = useAdditionalInfoDispatcher(setCampers);

  const [nextClicked, setNextClicked] = useState(false);

  useEffect(() => {
    let nextBtnRefValue: HTMLButtonElement; // Reference to the next step button

    if (nextBtnRef && nextBtnRef.current) {
      nextBtnRefValue = nextBtnRef.current;
      nextBtnRefValue.addEventListener("click", () => setNextClicked(true));
    }

    return () => {
      if (nextBtnRefValue) {
        nextBtnRefValue.removeEventListener("click", () =>
          setNextClicked(true),
        );
      }
    };
  }, [campers, nextBtnRef]);

  return (
    <Box pb={14}>
      <Text textStyle="displayXLarge">{`${campName} Registration`}</Text>
      <VStack alignItems="flex-start" spacing={8} marginTop={8}>
        <Text textStyle="displayLarge" textColor="primary.green.100">
          Camper-specific Additional Questions
        </Text>
        {campers.map((camper, camperIndex) => (
          <CamperQuestionsCard
            key={`additional_info_camper_${camperIndex}`}
            camper={camper}
            camperIndex={camperIndex}
            campSpecificFormQuestions={campSpecificFormQuestions}
            dispatchAdditionalInfoAction={dispatchAdditionalInfoAction}
            nextClicked={nextClicked}
          />
        ))}
        {hasEDLP && (
          <Box width="100%">
            <Divider borderColor="border.secondary.100" mb={6} />
            <Text textStyle="displayLarge" textColor="primary.green.100">
              Camp-specific Additional Questions
            </Text>
            <EarlyDropOffLatePickupCard
              requireEDLP={requireEDLP}
              setRequireEDLP={setRequireEDLP}
              nextClicked={nextClicked}
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AdditionalInfo;
