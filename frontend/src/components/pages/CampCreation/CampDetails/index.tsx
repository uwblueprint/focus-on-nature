import React, { useState } from "react";
import {
  Text,
  Textarea,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  Box, Select,
  HStack,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";


interface WaiverSectionCardProps {
  clauseIdx: number;
  clauseData: WaiverClause;
  onEditWaiverSection: (clause: WaiverClause, clauseIdx: number) => void;
  onDeleteWaiverSection: (idx: number) => void;
}

type CampCreationDetailsProps = {
  campName:string,
  campDescription:string,
  dailyCampFee:number,
  startTime:string,
  endTime:string,
  ageLower:number,
  ageUpper:number,
  campCapacity:number,
  offersEDLP:boolean,
  earliestDropOffTime:string,
  latestPickUpTime:string,
  priceEDLP:number,
  addressLine1:string,
  addressLine2:string,
  city:string,
  province:string,
  postalCode:string,
  campImageURL:string,
  handleCampName: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleCampDescription: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleDailyCampFee: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleStartTime: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleEndTime: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleAgeLower: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleAgeUpper: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleCampCapacity: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  toggleEDLP: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleEarliestDropOffTime: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleLatestPickUpTime: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handlePriceEDLP: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleAddressLine1: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleAddressLine2: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleCity: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleProvince: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handlePostalCode: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

const CampCreationDetails = ({
  campName,
  campDescription,
  dailyCampFee,
  startTime,
  endTime,
  ageLower,
  ageUpper,
  campCapacity,
  offersEDLP,
  earliestDropOffTime,
  latestPickUpTime,
  priceEDLP,
  addressLine1,
  addressLine2,
  city,
  province,
  postalCode,
  campImageURL,
  handleCampName,
  handleCampDescription,
  handleDailyCampFee,
  handleStartTime,
  handleEndTime,
  handleAgeLower,
  handleAgeUpper,
  handleCampCapacity,
  toggleEDLP,
  handleEarliestDropOffTime,
  handleLatestPickUpTime,
  handlePriceEDLP,  
  handleAddressLine1,
  handleAddressLine2,
  handleCity,
  handleProvince,
  handlePostalCode,
}: CampCreationDetailsProps): JSX.Element => {
  const [showErrors, setShowErrors] = useState<boolean>(false)
  console.log(showErrors)

  const errorText = (input: boolean|string|number|undefined, message:string) => {
    return(      
      <Text textStyle="caption" color="red" marginTop="8px" display={!input && showErrors?"":"none"}>
        {message}
      </Text>)
  }

  function getSectionTitle(number: number) {
    const code = "A".charCodeAt(0);
    return `Section ${String.fromCharCode(code + number)}`;
  }



  const {
    isOpen: editModalIsOpen,
    onOpen: editModalOnOpen,
    onClose: editModalOnClose,
  } = useDisclosure();

  const {
    isOpen: deleteModalIsOpen,
    onOpen: deleteModalOnOpen,
    onClose: deleteModalOnClose,
  } = useDisclosure();

  return (
    <>
      <Text textStyle="displayXLarge" marginTop="56px">Camp Details</Text>
      <Text textStyle="displayLarge" marginTop="32px">Overview</Text>
      <Button onClick={() => setShowErrors(true)}>Dummy Submit</Button>

      <Text textStyle="buttonSemiBold" marginTop="32px"> 
        Camp Name{" "}
        <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
      </Text>
      <Input width="575px" height="51px" marginTop="8px"
        value={campName}
        borderColor={!campName && showErrors?"red":"gray.200"}
        borderWidth={!campName && showErrors?"2px":"1px"}
        onChange={handleCampName}/>
      {errorText(campName,"You must add a name.")}

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Short Description (max 200 characters){" "}
        <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text> 
      </Text>
      <Textarea width="575px" marginTop="8px" maxLength={200}
        value={campDescription}
        borderColor={!campDescription && showErrors?"red":"gray.200"}
        borderWidth={!campDescription && showErrors?"2px":"1px"}
        onChange={handleCampDescription}/>
      {errorText(campDescription,"You must add a description.")}

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Daily Camp Fee{" "}
        <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
      </Text>
      <InputGroup width="275px" marginTop="8px">
        <InputLeftElement pointerEvents='none'color='black'fontSize='1.2em'>
          $
        </InputLeftElement>
        <Input type="number" placeholder='0.00' 
          value={dailyCampFee}
          borderColor={!dailyCampFee && showErrors?"red":"gray.200"}
          borderWidth={!dailyCampFee && showErrors?"2px":"1px"}
          onChange={handleDailyCampFee}/>
      </InputGroup>
      {errorText(dailyCampFee,"You must add a fee.")}

      <HStack alignItems="start" spacing={4} marginTop="24px">
        <Box width="160px">
          <Text textStyle="buttonSemiBold">
            Start Time{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
        
          <Input type="time" placeholder='XX:XX' width="160px" height="52px" marginTop="8px" 
            value={startTime}
            borderColor={!startTime && showErrors?"red":"gray.200"}
            borderWidth={!startTime && showErrors?"2px":"1px"}   
            onChange={handleStartTime}/> 
          {errorText(startTime,"You must specify a time.")}
        </Box>
        
        <Text paddingTop="45px"> to </Text>
        
        <Box width="160px">
          <Text textStyle="buttonSemiBold">
            End Time{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
        
          <Input type="time" placeholder='XX:XX' width="160px" height="52px" marginTop="8px"
            value={endTime}
            borderColor={!endTime && showErrors?"red":"gray.200"}
            borderWidth={!endTime && showErrors?"2px":"1px"}  
            onChange={handleEndTime}/>
          {errorText(endTime,"You must specify a time.")}
        </Box>
      </HStack>

      <HStack alignItems="start" spacing={8} marginTop="24px" marginBottom="24px">
        <Box>
          <Text textStyle="buttonSemiBold">
            Age Range{" "} 
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
          <HStack alignItems="start" spacing={4} marginTop="8px">
            <Box width="100px">
              <Input type="number" width="100px" height="52px"
                value={ageLower}
                borderColor={!ageLower && showErrors?"red":"gray.200"}
                borderWidth={!ageLower && showErrors?"2px":"1px"}onChange={handleAgeLower}/>
              {errorText(ageLower,"You must enter an age.")}
            </Box>
            <Text paddingTop="14px"> to </Text>
            <Box width="100px">
              <Input type="number" width="100px" height="52px"
                value={ageUpper}
                borderColor={!ageUpper && showErrors?"red":"gray.200"}
                borderWidth={!ageUpper && showErrors?"2px":"1px"}onChange={handleAgeUpper}/>
              {errorText(ageUpper,"You must enter an age.")} 
            </Box>
          </HStack>
        </Box>

        <Box>
            <Text textStyle="buttonSemiBold">
              Camp Capacity {" "}
              <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
            </Text>
            <Box width="200px">
              <Input type="number" width="200px" height="52px" marginTop="8px"
                value={campCapacity}
                borderColor={!campCapacity && showErrors?"red":"gray.200"}
                borderWidth={!campCapacity && showErrors?"2px":"1px"}onChange={handleCampCapacity}/> 
              {errorText(campCapacity,"You must enter a number.")} 
            </Box>
        </Box>
      </HStack>
      
      <Checkbox marginTop="8px" onChange={toggleEDLP}>
        <Text textStyle="buttonSemiBold">
          Camp offers early drop-off and late pick-up
        </Text>
      </Checkbox>
      

      {offersEDLP?(
        <>
          <HStack alignItems="start" spacing={4} marginTop="24px">
            <Box width="160px">
              <Text textStyle="buttonSemiBold"> 
                Earliest Drop-off{" "}
                <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
              </Text>
              
              <Input type="time" placeholder='XX:XX' width="160px" height="52px" marginTop="8px"
                value={earliestDropOffTime}
                borderColor={!earliestDropOffTime && showErrors?"red":"gray.200"}
                borderWidth={!earliestDropOffTime && showErrors?"2px":"1px"}onChange={handleEarliestDropOffTime}/> 
              {errorText(earliestDropOffTime,"You must specify a time.")}
            </Box>
            
            <Text paddingTop="45px"> to </Text>
            
            <Box width="160px">
              <Text textStyle="buttonSemiBold">
                Latest Pick-up{" "}
                <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
              </Text>
              <Input type="time" placeholder='XX:XX' width="160px" height="52px" marginTop="8px"
                value={latestPickUpTime}
                borderColor={!latestPickUpTime && showErrors?"red":"gray.200"}
                borderWidth={!latestPickUpTime && showErrors?"2px":"1px"}onChange={handleLatestPickUpTime}/> 
              {errorText(latestPickUpTime,"You must specify a time.")}
            </Box>
          </HStack>
          
          <Text textStyle="buttonSemiBold" marginTop="24px">
            EDLP Price Per 30 Minutes{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
        
          <InputGroup width="275px" marginTop="8px">
            <InputLeftElement pointerEvents='none'color='black'fontSize='1.2em'>
              $
            </InputLeftElement>
              <Input type="number" placeholder='0.00'
                value={priceEDLP}
                borderColor={!priceEDLP && showErrors?"red":"gray.200"}
                borderWidth={!priceEDLP && showErrors?"2px":"1px"}
                onChange={handlePriceEDLP}/>
          </InputGroup>
          {errorText(priceEDLP,"You must add a fee.")}
        </>
      ):(<></>)
      }
      <Box width="50%" maxWidth="870px" bg="#8C9196" height="2px" margin="40px 0"/>

      <Text textStyle="displayLarge">Camp Location</Text>

      <Text textStyle="buttonSemiBold" marginTop="32px">
        Address Line 1{" "}
        <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
      </Text>
      <Input width="575px" height="52px" marginTop="8px"
        value={addressLine1}
        borderColor={!addressLine1 && showErrors?"red":"gray.200"}
        borderWidth={!addressLine1 && showErrors?"2px":"1px"}
        onChange={handleAddressLine1}/>
      {errorText(addressLine1,"You must enter an address.")}

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Address Line 2{" "}
      </Text>
      <Input width="575px" height="52px" marginTop="8px"onChange={handleAddressLine2}/>

      <HStack alignItems="start" marginTop="24px" spacing="20px">
        <Box width="250px">
            <Text textStyle="buttonSemiBold">
              City{" "}
              <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
            </Text>
            <Input height="52px" marginTop="8px"
              value={city}
              borderColor={!city && showErrors?"red":"gray.200"}
              borderWidth={!city && showErrors?"2px":"1px"}
              onChange={handleCity}/> 
            {errorText(addressLine1,"You must enter a city name.")}
        </Box>
        <Box width="250px">
            <Text textStyle="buttonSemiBold">
              Province{" "}
              <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
            </Text>
            <Select height="52px" marginTop="8px"
              value={province}
              borderColor={(!province || province==="-") && showErrors?"red":"gray.200"}
              borderWidth={(!province || province==="-") && showErrors?"2px":"1px"}
              onChange={handleProvince}>
                <option value='-'>-</option>
                <option value='Alberta'>Alberta</option>
                <option value='British Columbia'>British Columbia</option>
                <option value='Manitoba'>Manitoba</option>
                <option value='New Brunswick'>New Brunswick</option>
                <option value='Newfoundland and Labrador'>Newfoundland and Labrador</option>
                <option value='Northwest Territories'>Northwest Territories</option>
                <option value='Nova Scotia'>Nova Scotia</option>
                <option value='Nunavut'>Nunavut</option>
                <option value='Ontario'>Ontario</option>
                <option value='Prince Edward Island'>Prince Edward Island</option>
                <option value='Quebec'>Quebec</option>
                <option value='Saskatchewan'>Saskatchewan</option>
                <option value='Yukon'>Yukon</option>
            </Select>
            {errorText(!(!province || province==="-"),"You must select a province.")}
        </Box>
        <Box width="250px">
            <Text textStyle="buttonSemiBold">
              Postal Code{" "}
              <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
            </Text>
            <Input height="52px" marginTop="8px" maxLength={7}
              value={postalCode}
              borderColor={!postalCode && showErrors?"red":"gray.200"}
              borderWidth={!postalCode && showErrors?"2px":"1px"}
              onChange={handlePostalCode}/> 
            {errorText(postalCode,"You must enter a postal code.")}
        </Box>
      </HStack>

      <Box width="50%" maxWidth="870px" bg="#8C9196" height="2px" margin="40px 0"/>

      <Text textStyle="displayLarge">Camp Image</Text>

      <Box marginTop="32px" bg="tomato" width="200px" marginBottom="56px">image thing</Box>
      <Input type="file" width="500px"/>



    </>
  );
};

export default CampCreationDetails;