import React from "react";
import { VStack, Text, Center } from "@chakra-ui/react";

const NoRegistrationQuestionsCard = (): React.ReactElement => {
  return (
    <Center
      backgroundColor="background.grey.200"
      marginBottom="2"
      borderRadius="5"
      height="80px"
    >
      <VStack spacing={0}>
        <Text fontSize="large">No questions added.</Text>
        <Text fontSize="sm" color="text.grey.500" mt={0}>
          Create questions by clicking the + Add Question button above.
        </Text>
      </VStack>
    </Center>
  );
};

export default NoRegistrationQuestionsCard;
