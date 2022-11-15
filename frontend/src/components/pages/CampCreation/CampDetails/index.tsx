import React from "react";
import { Box, Checkbox, Input, Text } from "@chakra-ui/react";

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
    <Box>
      <Text textStyle="displayXLarge">Camp Details</Text>
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
    </Box>
  );
};

export default CampCreationDetails;
