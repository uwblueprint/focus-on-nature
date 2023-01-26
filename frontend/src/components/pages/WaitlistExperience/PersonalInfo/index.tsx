import React from "react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Text, VStack } from "@chakra-ui/react";
import { CampResponse } from "../../../../types/CampsTypes";
import { CreateWaitlistedCamperDTO } from "../../../../types/CamperTypes";
import {
  checkAge,
  checkEmail,
  checkFirstName,
  checkLastName,
  checkPhoneNumber,
  usePersonalInfoDispatcher,
} from "./personalInfoReducer";
import PersonalInfoCard, {
  CamperCardInputTypes,
} from "../../../common/personalInfoRegistration/PersonalInfoCard";
import CamperCardDeletionButton from "../../../common/personalInfoRegistration/CamperCardDeletionButton";
import { PersonalInfoActions } from "../../../../types/PersonalInfoTypes";

type WaitlistPersonalInfoPageProps = {
  nextBtnRef: React.RefObject<HTMLButtonElement>;
  campers: CreateWaitlistedCamperDTO[];
  camp: CampResponse;
  setCampers: React.Dispatch<React.SetStateAction<CreateWaitlistedCamperDTO[]>>;
};

const WaitlistPersonalInfoPage = ({
  nextBtnRef,
  campers,
  camp,
  setCampers,
}: WaitlistPersonalInfoPageProps): React.ReactElement => {
  const dispatchPersonalInfoAction = usePersonalInfoDispatcher(setCampers);
  return (
    <Box pb={14} px="10%">
      <Text textStyle="displayXLarge">{camp.name} Registration</Text>
      <Text
        color="#10741A"
        py={7}
        textStyle={{ sm: "xSmallMedium", md: "xSmallBold", lg: "displayLarge" }}
      >
        Camper Information
      </Text>

      <VStack spacing={6} pb={6}>
        {campers.map((camper, camperIndex) => (
          <PersonalInfoCard
            cardTitle={`Camper #${camperIndex + 1}`}
            nextBtnRef={nextBtnRef}
            key={camperIndex}
            deleteCardButton={
              camperIndex > 0 ? (
                <CamperCardDeletionButton
                  onDeleteCallBack={() =>
                    dispatchPersonalInfoAction({
                      type: PersonalInfoActions.DELETE_CAMPER,
                      camperIndex,
                    })
                  }
                  name={`${camper.firstName} ${camper.lastName}`}
                />
              ) : undefined
            }
            camperCardLayout={{
              templateColumns: {
                sm: "repeat(6, 1fr)",
              },
              gap: { sm: "2", md: "2", lg: "4" },
            }}
            fields={[
              {
                value: camper.firstName,
                field: "firstName",
                heading: "First Name",
                required: true,
                errorInfo: {
                  errorMessage: "This field cannot be empty",
                  isInvalid: !checkFirstName(camper.firstName),
                },
                dispatchAction(eventValue) {
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    camperIndex,
                    field: "firstName",
                    data: eventValue,
                  });
                },
                type: CamperCardInputTypes.INPUT,
                colSpan: {
                  sm: 6,
                  md: 3,
                  lg: 2,
                },
              },
              {
                value: camper.lastName,
                field: "lastName",
                heading: "Last Name",
                required: true,
                errorInfo: {
                  errorMessage: "This field cannot be empty",
                  isInvalid: !checkLastName(camper.lastName),
                },
                dispatchAction(eventValue) {
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    camperIndex,
                    field: "lastName",
                    data: eventValue,
                  });
                },
                type: CamperCardInputTypes.INPUT,
                colSpan: {
                  sm: 6,
                  md: 3,
                  lg: 2,
                },
              },
              {
                value: camper.age ? camper.age.toString() : "",
                field: "age",
                heading: "Age",
                required: true,
                errorInfo: {
                  errorMessage: `Camper age must be between ${camp.ageLower} - ${camp.ageUpper} years old`,
                  isInvalid: !checkAge(
                    camper.age,
                    camp.ageUpper,
                    camp.ageLower,
                  ),
                },
                dispatchAction(eventValue) {
                  dispatchPersonalInfoAction({
                    type: PersonalInfoActions.UPDATE_CAMPER,
                    camperIndex,
                    field: "age",
                    data: parseInt(eventValue, 10),
                  });
                },
                type: CamperCardInputTypes.NUMBERINPUT,
                colSpan: {
                  sm: 6,
                  md: 3,
                  lg: 2,
                },
              },
            ]}
          />
        ))}
      </VStack>
      <Button
        w="100%"
        backgroundColor="primary.green.100"
        color="#ffffff"
        onClick={() => {
          dispatchPersonalInfoAction({
            type: PersonalInfoActions.ADD_CAMPER,
          });
        }}
      >
        <SmallAddIcon boxSize={6} />
        <Text pl={3} textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
          Add Another Camper
        </Text>
      </Button>

      <Divider py={4} borderColor="border.secondary.100" />
      <Text
        py={5}
        color="#10741A"
        textStyle={{ sm: "xSmallMedium", md: "xSmallBold", lg: "displayLarge" }}
      >
        Contact Information
      </Text>
      <PersonalInfoCard
        cardTitle="Primary Contact"
        nextBtnRef={nextBtnRef}
        camperCardLayout={{
          templateColumns: {
            sm: "repeat(4, 1fr)",
          },
          gap: { sm: "2", md: "2", lg: "4" },
        }}
        fields={[
          {
            value: campers[0].contactFirstName,
            field: "firstName",
            heading: "First Name",
            required: true,
            errorInfo: {
              errorMessage: "This field cannot be empty",
              isInvalid: !checkFirstName(campers[0].contactFirstName),
            },
            dispatchAction(eventValue) {
              dispatchPersonalInfoAction({
                type: PersonalInfoActions.UPDATE_CONTACT,
                contactIndex: 0,
                field: "contactFirstName",
                data: eventValue,
              });
            },
            type: CamperCardInputTypes.INPUT,
            colSpan: {
              sm: 4,
              md: 2,
              lg: 1,
            },
          },
          {
            value: campers[0].contactLastName,
            field: "lastName",
            heading: "Last Name",
            required: true,
            errorInfo: {
              errorMessage: "This field cannot be empty",
              isInvalid: !checkLastName(campers[0].contactLastName),
            },
            dispatchAction(eventValue) {
              dispatchPersonalInfoAction({
                type: PersonalInfoActions.UPDATE_CONTACT,
                contactIndex: 0,
                field: "contactLastName",
                data: eventValue,
              });
            },
            type: CamperCardInputTypes.INPUT,
            colSpan: {
              sm: 4,
              md: 2,
              lg: 1,
            },
          },

          {
            value: campers[0].contactEmail,
            field: "email",
            heading: "Email",
            required: true,
            errorInfo: {
              errorMessage: "This field cannot be empty",
              isInvalid: !checkEmail(campers[0].contactEmail),
            },
            dispatchAction(eventValue) {
              dispatchPersonalInfoAction({
                type: PersonalInfoActions.UPDATE_CONTACT,
                contactIndex: 0,
                field: "contactEmail",
                data: eventValue,
              });
            },
            type: CamperCardInputTypes.INPUT,
            colSpan: {
              sm: 4,
              md: 2,
              lg: 1,
            },
          },

          {
            value: campers[0].contactNumber,
            field: "phoneNumber",
            heading: "Phone Number",
            required: true,
            errorInfo: {
              errorMessage: "This field cannot be empty",
              isInvalid: !checkPhoneNumber(campers[0].contactNumber),
            },
            dispatchAction(eventValue) {
              dispatchPersonalInfoAction({
                type: PersonalInfoActions.UPDATE_CONTACT,
                contactIndex: 0,
                field: "contactNumber",
                data: eventValue,
              });
            },
            type: CamperCardInputTypes.INPUT,
            colSpan: {
              sm: 4,
              md: 2,
              lg: 1,
            },
          },
        ]}
      />
    </Box>
  );
};

export default WaitlistPersonalInfoPage;
