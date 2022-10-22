import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const AddSessionsForm = () => {
  return (
    <Box paddingX="64px" paddingY="80px">
      <VStack align="flex-start">
        <Text textStyle="displayLarge">Add Camp Session(s)</Text>
        <FormControl isRequired>
          <FormLabel>First name</FormLabel>
          <Input placeholder="First name" />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default AddSessionsForm;
