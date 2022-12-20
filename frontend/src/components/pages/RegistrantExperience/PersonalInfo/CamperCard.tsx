import React from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import {
  PersonalInfoActions,
  PersonalInfoReducerDispatch,
} from "../../../../types/PersonalInfoTypes";
import { Camper } from "../../../../types/CamperTypes";

type CamperCardProps = {
  camper: Camper;
  camperId: number;
  setPersonalInfo: (action: PersonalInfoReducerDispatch) => void;
};

const CamperCard = ({
  camper,
  camperId,
  setPersonalInfo,
}: CamperCardProps): React.ReactElement => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camper #{camperId + 1}</Text>
      <Text>First tName</Text>
      <Input
        value={camper.firstName}
        onChange={(event) =>
          setPersonalInfo({
            type: PersonalInfoActions.UPDATE_CAMPER,
            field: "firstName",
            camperId,
            data: event.target.value,
          })
        }
      />
      <Text>Last Name</Text>
      <Input
        value={camper.lastName}
        onChange={(event) =>
          setPersonalInfo({
            type: PersonalInfoActions.UPDATE_CAMPER,
            field: "lastName",
            camperId,
            data: event.target.value,
          })
        }
      />
      <Text>Age</Text>
      <Input
        value={camper.age}
        onChange={(event) =>
          setPersonalInfo({
            type: PersonalInfoActions.UPDATE_CAMPER,
            field: "age",
            camperId,
            data: event.target.value,
          })
        }
      />
      <Text>Allergies</Text>
      <Input
        value={camper.specialNeeds ? camper.specialNeeds : ""}
        onChange={(event) =>
          setPersonalInfo({
            type: PersonalInfoActions.UPDATE_CAMPER,
            field: "allergies",
            camperId,
            data: event.target.value,
          })
        }
      />

      <Text>Special Needs</Text>
      <Input
        value={camper.specialNeeds ? camper.specialNeeds : ""}
        onChange={(event) =>
          setPersonalInfo({
            type: PersonalInfoActions.UPDATE_CAMPER,
            field: "specialNeeds",
            camperId,
            data: event.target.value,
          })
        }
      />
      {camperId > 0 ? (
        <Button
          onClick={() => {
            setPersonalInfo({
              type: PersonalInfoActions.DELETE_CAMPER,
              camperId,
            });
          }}
          colorScheme="blue"
        >
          DELETE CAMPER
        </Button>
      ) : null}
    </Box>
  );
};

export default CamperCard;
