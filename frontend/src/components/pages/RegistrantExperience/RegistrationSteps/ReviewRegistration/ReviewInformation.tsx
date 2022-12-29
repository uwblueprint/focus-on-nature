import { Box, Checkbox, Text } from "@chakra-ui/react";
import React from "react";

type ReviewInformationProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const ReviewInformation = ({
  isChecked,
  toggleChecked,
}: ReviewInformationProps): React.ReactElement => {
  return (
    <Box>
      <Text textStyle="displayXLarge">Camp Registration</Text>
      <Text>Review Registration</Text>

      <Text textStyle={{ base: 'xSmallBold', md: "displayLarge" }} marginTop={{ base: "12px", md: "32px" }} color="#10741A">Camp-specific Additional Questions</Text>

      <Box marginTop="32px" bg="#FBFBFB" borderRadius="10px" boxShadow="0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)">
        <Box 
          bg="white" 
          padding={{ base: '12px 20px', sm: '16px 40px',md: '32px 80px' }} 
          borderTopRadius="10px"
          textStyle={{ base: 'xSmallBold', md: "displayLarge" }} 
        >
            Early Drop-off and Late Pick-up
        </Box>
        <Box padding={{ base: '12px 20px', sm: '24px 40px',md: '40px 80px' }} >
          
          <Text textStyle={{ base: 'xSmallBold', md: "displayRegular" }}>
            Do your camper(s) require early drop-off or late pick-up? 
          </Text>
          <Text textStyle={{ base: 'xSmallRegular', md: "displayRegular" }}>
            Note: additional costs will apply. If needed, you may select drop-off and/or pick-up times. 
          </Text>
          <RadioGroup name="needs-edlp" colorScheme='green' marginTop="12px" defaultValue='2'>
            <Stack spacing={0}>
              <Radio value='1'onChange={() => setNeedsEDLP(true)}>Yes</Radio>
              <Radio value='2'onChange={() => setNeedsEDLP(false)}>No</Radio>
            </Stack>
          </RadioGroup>
        </Box>

      </Box>
      
      <Box display={needsEDLP ? "" : "none"}>
        <Text textStyle={{ base: 'xSmallRegular', md: "bodyRegular" }} marginTop="20px" marginBottom="11px">The cost of Early Dropoff Late Pickup is ${DUMMY_EDLP_COST} per 30 minutes for pickup or dropoff for each child. </Text>
        <Text as='i' textStyle={{ base: 'xSmallRegular', md: "bodyRegular" }} color="text.critical.100">Note: EDLP applies to all children in a given registeration. For specific requests, contact  Focus On Nature admin at camps@focusonnature.ca </Text>
        <Accordion allowToggle>
           
          {camp?.campSessions.map((session: CampSession, key: number) => {
           
            return (
              <EdlpSessionRegistration
                key={key*1000}
                sessionNumber={key+1}
                camp={camp}
                numberOfCampers = {campers.length}
                edlpCost={DUMMY_EDLP_COST}
                session={session}
                edlpChoices={edlpChoices}
                sessionEdlpFees={sessionEdlpFees}
                setEdlpChoices={setEdlpChoices}
                setTotalEdlpFees={setTotalEdlpFees}
                setSessionEdlpFees={setSessionEdlpFees}
              />
            )
          })}

        </Accordion>

      </Box>

      <Box height="150px"/>
 
    </Box>
  );
};

export default ReviewInformation;
