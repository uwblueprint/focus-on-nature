import React, { Dispatch, SetStateAction } from "react";
import { Box, Checkbox, Text, Input, Button} from "@chakra-ui/react";
import { CampResponse } from "../../../../types/CampsTypes";

type AdditionalInfoProps = {
  camp: CampResponse | undefined
  edlpChoices: Record<string, unknown>;
  edlpFees: number;
  setEdlpChoices:  Dispatch<SetStateAction<Record<string, unknown>>>;
  setEdlpFees: Dispatch<SetStateAction<number>>;
};

const dummyEdlpChoices = {
  "Session 1":{
    "Thu Jun 30 2022 00:00:00 GMT+0000 (Coordinated Universal Time)":["7:00 AM","7:00 PM"],
    "Fri Jul 01 2022 00:00:00 GMT+0000 (Coordinated Universal Time)":["7:00 AM","7:00 PM"],
  },
  "Session 2":{
    "Thu Jun 30 2022 00:00:00 GMT+0000 (Coordinated Universal Time)":["7:00 AM","7:00 PM"],
    "Fri Jul 01 2022 00:00:00 GMT+0000 (Coordinated Universal Time)":["7:00 AM","7:00 PM"],
    "Fri Jul 02 2022 00:00:00 GMT+0000 (Coordinated Universal Time)":["7:00 AM","-"],
  }
}

const dummyEdlpFees = 100

const AdditionalInfo = ({
  camp,
  edlpChoices,
  edlpFees,
  setEdlpChoices,
  setEdlpFees,
}: AdditionalInfoProps): React.ReactElement => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Registration</Text>
      <Text>Additional Info</Text>

      <Button
        size="lg"
        borderColor="black"
        onChange={() => {setEdlpChoices(dummyEdlpChoices); setEdlpFees(dummyEdlpFees);}}
      >lmao</Button>
 
    </Box>
  );
};

export default AdditionalInfo;
