import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Box, Divider, Text, VStack, Accordion } from "@chakra-ui/react";

import { RegistrantExperienceCamper } from "../../../../../types/CamperTypes";
import { CampResponse, CampSession } from "../../../../../types/CampsTypes";
import EdlpSessionRegistration from "./edlpSessionRegistration";
import { useAdditionalInfoDispatcher } from "./additionalInfoReducer";
import CamperQuestionsCard from "./QuestionCards/CamperQuestionsCard";
import EarlyDropOffLatePickupCard from "./QuestionCards/EarlyDropOffLatePickupCard";
import { EdlpSelections } from "../../../../../types/RegistrationTypes";

type AdditionalInfoProps = {
  selectedSessions: CampSession[];
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  campers: RegistrantExperienceCamper[];
  setCampers: React.Dispatch<
    React.SetStateAction<RegistrantExperienceCamper[]>
  >;
  camp: CampResponse;
  hasEDLP: boolean;
  requireEDLP: boolean | null;
  setRequireEDLP: React.Dispatch<React.SetStateAction<boolean | null>>;
  edlpSelections: EdlpSelections;
  setEdlpSelections: Dispatch<SetStateAction<EdlpSelections>>;
};

const AdditionalInfo = ({
  selectedSessions,
  nextBtnRef,
  campers,
  setCampers,
  camp,
  hasEDLP,
  requireEDLP,
  setRequireEDLP,
  edlpSelections,
  setEdlpSelections,
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
      <Text textStyle="displayXLarge">{`${camp.name} Registration`}</Text>
      <VStack alignItems="flex-start" spacing={8} marginTop={8}>
        <Text textStyle="displayLarge" textColor="primary.green.100">
          Camper-specific Additional Questions
        </Text>
        {campers.map((camper, camperIndex) => (
          <CamperQuestionsCard
            key={`additional_info_camper_${camperIndex}`}
            camper={camper}
            camperIndex={camperIndex}
            campSpecificFormQuestions={camp.formQuestions.filter(
              (question) => question.category === "CampSpecific",
            )}
            dispatchAdditionalInfoAction={dispatchAdditionalInfoAction}
            nextClicked={nextClicked}
          />
        ))}
        {hasEDLP && (
          <>
            <Box width="100%">
              <Divider borderColor="border.secondary.100" mb={6} />
              <Text textStyle="displayLarge" textColor="primary.green.100">
                Early Drop-off and Late Pick-up
              </Text>

              <EarlyDropOffLatePickupCard
                requireEDLP={requireEDLP}
                setRequireEDLP={setRequireEDLP}
                nextClicked={nextClicked}
              />

              <Box display={requireEDLP ? "" : "none"}>
                <Text
                  textStyle={{ base: "xSmallRegular", md: "bodyRegular" }}
                  marginTop="20px"
                  marginBottom="11px"
                >
                  The cost of Early Dropoff Late Pickup is ${camp.pickupFee} per
                  30 minutes for pickup or dropoff for each child.
                </Text>
                <Text
                  as="i"
                  textStyle={{ base: "xSmallRegular", md: "bodyRegular" }}
                  color="text.critical.100"
                >
                  Note: EDLP applies to all children in a given registeration.
                  For specific requests, contact Focus On Nature admin at
                  camps@focusonnature.ca
                </Text>

                <Accordion allowToggle>
                  {selectedSessions.map(
                    (campSession: CampSession, campSessionIndex: number) => {
                      return (
                        <EdlpSessionRegistration
                          key={`session_${campSession.id}_edlp`}
                          selectedSessionIndex={campSessionIndex}
                          camp={camp}
                          edCost={camp.dropoffFee}
                          lpCost={camp.pickupFee}
                          session={campSession}
                          edlpSelections={edlpSelections}
                          setEdlpSelections={setEdlpSelections}
                        />
                      );
                    },
                  )}
                </Accordion>
              </Box>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default AdditionalInfo;
