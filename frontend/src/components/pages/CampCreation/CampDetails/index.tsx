import React from "react";
<<<<<<< HEAD
import { Box, Checkbox, Input, Text } from "@chakra-ui/react";
=======
import { Box, Text } from "@chakra-ui/react";
import CampCreationForm from "./CampCreationForm";
>>>>>>> 963db1b (first commit)

type CampCreationDetailsProps = {
  campDetailsDummyOne: boolean;
  campDetailsDummyTwo: boolean;
  campDetailsDummyThree: string;
  toggleCampDetailsDummyOne: () => void;
  toggleCampDetailsDummyTwo: () => void;
  handleCampDetailsDummyThree: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

const CampCreationDetails = ({
  campDetailsDummyOne,
  campDetailsDummyTwo,
  campDetailsDummyThree,
  toggleCampDetailsDummyOne,
  toggleCampDetailsDummyTwo,
  handleCampDetailsDummyThree,
}: CampCreationDetailsProps): React.ReactElement => {
  return (
    <Box mx="8vw" my="5vh">
      <Text textStyle="displayXLarge">Camp Details</Text>
<<<<<<< HEAD
      <Text>campDetailsDummyOne: {String(campDetailsDummyOne)}</Text>
      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={campDetailsDummyOne}
        onChange={toggleCampDetailsDummyOne}
      />
      <Text>campDetailsDummyTwo: {String(campDetailsDummyTwo)}</Text>
      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={campDetailsDummyTwo}
        onChange={toggleCampDetailsDummyTwo}
      />
      <Text>campDetailsDummyThree: {campDetailsDummyThree}</Text>
      <Input
        value={campDetailsDummyThree}
        onChange={handleCampDetailsDummyThree}
      />
=======
      <CampCreationForm/>
>>>>>>> 963db1b (first commit)
    </Box>
  );
};

export default CampCreationDetails;
