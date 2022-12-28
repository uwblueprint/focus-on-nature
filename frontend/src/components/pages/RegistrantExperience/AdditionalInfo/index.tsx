import React, { useState, Dispatch, SetStateAction } from "react";
import { Box, Text, Stack, RadioGroup, Radio, Accordion } from "@chakra-ui/react";
import { CampResponse, CampSession } from "../../../../types/CampsTypes";
import EdlpSessionRegistration, {EdlpChoice} from "./edlpSessionRegistration";


type AdditionalInfoProps = {
  camp: CampResponse | undefined
  campers: string[]
  edlpChoices: EdlpChoice[][];
  setEdlpChoices:  Dispatch<SetStateAction<EdlpChoice[][]>>;
  setTotalEdlpFees: Dispatch<SetStateAction<number>>;
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
  campers,
  edlpChoices,
  setEdlpChoices,
  setTotalEdlpFees,
}: AdditionalInfoProps): React.ReactElement => {

  const [needsEDLP,setNeedsEDLP] = useState<boolean>(false);
  const DUMMY_EDLP_COST = 5
  const [sessionEdlpFees, setSessionEdlpFees] = useState<number[]>(Array((camp?.campSessions)?.length).fill(0))

  return (
    <Box>
      <Text textStyle={{ base: 'xSmallBold', md: "displayXLarge" }}>{camp?.name} Registration</Text>
      <Text textStyle={{ base: 'xSmallRegular', md: "displayLarge" }} marginTop="32px" color="#10741A">Camper-specific Additional Questions</Text>
      
      {campers.map((camper: string, key: number) => {
          return (
            <Box key={key}>
              {camper}
            </Box>
          );
        })}
      
      <Box bg="border.secondary.100" height="1px" margin="32px 0"/>

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

export default AdditionalInfo;
