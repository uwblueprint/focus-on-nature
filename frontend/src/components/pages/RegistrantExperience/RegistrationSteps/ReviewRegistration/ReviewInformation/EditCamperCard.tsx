import React, { useMemo, useState } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Spacer,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../../../types/PersonalInfoTypes";
import { RegistrantExperienceCamper } from "../../../../../../types/CamperTypes";
import {
  checkAge,
  checkFirstName,
  checkLastName,
} from "../../PersonalInfo/personalInfoReducer";
import { CampResponse } from "../../../../../../types/CampsTypes";
import EditFormLabel from "./EditFormLabel";
import EditCardFooter from "./EditCardFooter";
import EditCardHeader from "./EditCardHeader";

type EditCamperCardProps = {
  camper: RegistrantExperienceCamper;
  camperIndex: number;
  camp: CampResponse;
  dispatchPersonalInfoAction: (action: PersonalInfoReducerDispatch) => void;
};

const EditCamperCard = ({
  camper,
  camperIndex,
  dispatchPersonalInfoAction,
  camp,
}: EditCamperCardProps): React.ReactElement => {
  const [updateMemo, setUpdateMemo] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialCamper: RegistrantExperienceCamper = useMemo(() => camper, [
    updateMemo,
  ]);

  const [editing, setEditing] = useState(false);

  const [isFirstNameInvalid, setIsFirstNameInvalid] = useState(false);
  const [isLastNameInvalid, setIsLastNameInvalid] = useState(false);
  const [isAgeInvalid, setIsAgeInvalid] = useState(false);

  const updateFormErrorMsgs = () => {
    let valid = true;

    if (!checkFirstName(camper.firstName)) {
      setIsFirstNameInvalid(true);
      valid = false;
    }
    if (!checkLastName(camper.lastName)) {
      setIsLastNameInvalid(true);
      valid = false;
    }
    if (!checkAge(camper.age, camp.ageUpper, camp.ageLower)) {
      setIsAgeInvalid(true);
      valid = false;
    }
    if (valid) {
      setEditing(false);
      setUpdateMemo(updateMemo + 1);
    }
  };

  const EditCamperOnDelete = () => {
    setIsFirstNameInvalid(false);
    setIsLastNameInvalid(false);
    setIsAgeInvalid(false);

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CAMPER,
      field: "firstName",
      camperIndex,
      data: initialCamper.firstName,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CAMPER,
      field: "lastName",
      camperIndex,
      data: initialCamper.lastName,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CAMPER,
      field: "age",
      camperIndex,
      data: initialCamper.age,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CAMPER,
      field: "allergies",
      camperIndex,
      data: initialCamper.allergies,
    });

    dispatchPersonalInfoAction({
      type: PersonalInfoActions.UPDATE_CAMPER,
      field: "specialNeeds",
      camperIndex,
      data: initialCamper.specialNeeds,
    });

    setEditing(false);
  };

  return (
    <Box boxShadow="lg" rounded="xl" borderWidth={1} width="100%" mt={2} mb={2}>
      <EditCardHeader
        title={`${camper.firstName} ${camper.lastName}`}
        onClick={() => setEditing(true)}
        editing={editing}
      />

      <Box
        zIndex={0}
        backgroundColor="#FFFFFFAA"
        borderRadius="0px 0px 10px 10px"
        _hover={{ cursor: editing ? "auto" : "not-allowed" }}
      >
        <Box zIndex={editing ? 1 : -1} position="relative" bg="background.grey.500" borderRadius="0px 0px 16px 16px">
          <Box px={{ sm: "5", lg: "20" }}>
            <Wrap pt={7}>
              <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
                <FormControl isInvalid={isFirstNameInvalid}>
                  <EditFormLabel title="First Name" required />
                  <Input
                    backgroundColor="#FFFFFF"
                    value={camper.firstName}
                    onChange={(event) => {
                      setIsFirstNameInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "firstName",
                        camperIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>

              <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
                <FormControl isInvalid={isLastNameInvalid}>
                  <EditFormLabel title="First Name" required />
                  <Input
                    backgroundColor="#FFFFFF"
                    value={camper.lastName}
                    onChange={(event) => {
                      setIsLastNameInvalid(false);
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "lastName",
                        camperIndex,
                        data: event.target.value,
                      });
                    }}
                  />
                  <FormErrorMessage>
                    This field cannot be empty
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>

              <WrapItem width={{ sm: "100%", md: "45%", lg: "30%" }}>
                <FormControl isInvalid={isAgeInvalid}>
                  <EditFormLabel title="Age" required />
                  <Input
                    backgroundColor="#FFFFFF"
                    value={camper.age}
                    onChange={(event) => {
                      setIsAgeInvalid(false);
                      if (Number.isNaN(parseInt(event.target.value, 10))) {
                        dispatchPersonalInfoAction({
                          type: PersonalInfoActions.UPDATE_CAMPER,
                          field: "age",
                          camperIndex,
                          data: "",
                        });
                      } else {
                        dispatchPersonalInfoAction({
                          type: PersonalInfoActions.UPDATE_CAMPER,
                          field: "age",
                          camperIndex,
                          data: parseInt(event.target.value, 10),
                        });
                      }
                    }}
                  />

                  <FormErrorMessage>
                    Camper age must be between {camp.ageLower} - {camp.ageUpper}{" "}
                    years old
                  </FormErrorMessage>
                </FormControl>
              </WrapItem>
            </Wrap>

            <Wrap py={7}>
              <WrapItem width={{ sm: "100%", md: "47%" }}>
                <FormControl>
                  <EditFormLabel
                    title="Allergies"
                    subtitle="Please list any allergies the camper has"
                  />
                  <Textarea
                    backgroundColor="#FFFFFF"
                    value={camper.allergies ? camper.allergies : ""}
                    onChange={(event) =>
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "allergies",
                        camperIndex,
                        data: event.target.value,
                      })
                    }
                  />
                </FormControl>
              </WrapItem>

              <Spacer />

              <WrapItem width={{ sm: "100%", md: "47%" }}>
                <FormControl>
                  <EditFormLabel
                    title="Special Needs"
                    subtitle="Please list any special needs the camper has"
                  />
                  <Textarea
                    backgroundColor="#FFFFFF"
                    value={camper.specialNeeds ? camper.specialNeeds : ""}
                    onChange={(event) =>
                      dispatchPersonalInfoAction({
                        type: PersonalInfoActions.UPDATE_CAMPER,
                        field: "specialNeeds",
                        camperIndex,
                        data: event.target.value,
                      })
                    }
                  />
                </FormControl>
              </WrapItem>
            </Wrap>
          </Box>

          <EditCardFooter
            onDelete={EditCamperOnDelete}
            updateFormErrorMsgs={updateFormErrorMsgs}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EditCamperCard;
