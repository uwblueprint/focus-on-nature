import React, { useState, useMemo } from "react";
import { Accordion, Box, Wrap, WrapItem } from "@chakra-ui/react";
import EditCardFooter from "./EditCardFooter";
import EditCardHeader from "./EditCardHeader";
import { CampResponse, CampSession } from "../../../../../../types/CampsTypes";
import EDLPSelectionControl from "../../AdditionalInfo/QuestionCards/EDLPSelectionControl";
import EDLPSessionRegistration from "../../AdditionalInfo/edlpSessionRegistration";
import { EdlpSelections } from "../../../../../../types/RegistrationTypes";

type EditEDLPCardProps = {
  requireEDLP: boolean | null;
  setRequireEDLP: React.Dispatch<React.SetStateAction<boolean | null>>;
  selectedSessions: CampSession[];
  camp: CampResponse;
  edlpSelections: EdlpSelections;
  setEdlpSelections: React.Dispatch<React.SetStateAction<EdlpSelections>>;
  isEditing: number;
  setIsEditing: React.Dispatch<React.SetStateAction<number>>;
};

const EditEDLPCard = ({
  requireEDLP,
  setRequireEDLP,
  selectedSessions,
  camp,
  edlpSelections,
  setEdlpSelections,
  isEditing,
  setIsEditing,
}: EditEDLPCardProps): React.ReactElement => {
  const [editingIndividual, setEditingIndividual] = useState(false);

  const setEditing = (state: boolean) => {
    setEditingIndividual(state); // Local editing state.
    setIsEditing(state ? isEditing + 1 : isEditing - 1); // Global editing state.
  };
  const [updateMemo, setUpdateMemo] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialRequireEDLP = useMemo(() => requireEDLP, [updateMemo]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialEDLPSelections = useMemo(() => edlpSelections, [updateMemo]);

  const updateFormErrorMsgs = () => {
    setEditing(false);
    setUpdateMemo(updateMemo + 1);
  };

  const EditEDLPOnCancel = () => {
    if (initialRequireEDLP && initialEDLPSelections) {
      setRequireEDLP(initialRequireEDLP);
      setEdlpSelections(initialEDLPSelections);
    }
    setEditing(false);
  };

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%" mt={2} mb={2}>
      <EditCardHeader
        title="Early Drop-off and Late Pick-up"
        onClick={() => setEditing(true)}
        editing={editingIndividual}
      />

      <Box
        zIndex={0}
        backgroundColor="#FFFFFFAA"
        borderRadius="0px 0px 10px 10px"
        _hover={{ cursor: editingIndividual ? "auto" : "not-allowed" }}
      >
        <Box
          zIndex={editingIndividual ? 1 : -1}
          position="relative"
          bg="background.grey.500"
          borderRadius="0px 0px 16px 16px"
        >
          <Box px={{ sm: "5", lg: "20" }}>
            <Wrap>
              <WrapItem py={4}>
                <EDLPSelectionControl
                  requireEDLP={requireEDLP}
                  setRequireEDLP={setRequireEDLP}
                  nextClicked
                />
              </WrapItem>
            </Wrap>

            {requireEDLP && (
              <Accordion
                allowToggle
                mb={6}
                index={editingIndividual ? undefined : -1}
              >
                {selectedSessions.map(
                  (campSession: CampSession, campSessionIndex: number) => {
                    return (
                      <EDLPSessionRegistration
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
            )}
          </Box>
          <EditCardFooter
            onDelete={EditEDLPOnCancel}
            updateFormErrorMsgs={updateFormErrorMsgs}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EditEDLPCard;
