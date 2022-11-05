import React from "react";
import { Box, Checkbox, Text } from "@chakra-ui/react";

type RegistrationFormProps = {
  registrationFormDummyOne: boolean;
  registrationFormDummyTwo: boolean;
  toggleRegistrationFormDummyOne: () => void;
  toggleRegistrationFormDummyTwo: () => void;
};

const RegistrationForm = ({
  registrationFormDummyOne,
  registrationFormDummyTwo,
  toggleRegistrationFormDummyOne,
  toggleRegistrationFormDummyTwo,
}: RegistrationFormProps): JSX.Element => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Registration Form</Text>
      <Text>registrationFormDummyOne: {String(registrationFormDummyOne)}</Text>
      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={registrationFormDummyOne}
        onChange={toggleRegistrationFormDummyOne}
      />
      <Text>registrationFormDummyTwo: {String(registrationFormDummyTwo)}</Text>
      <Checkbox
        size="lg"
        borderColor="black"
        isChecked={registrationFormDummyTwo}
        onChange={toggleRegistrationFormDummyTwo}
      />
    </Box>
  );
};

export default RegistrationForm;
