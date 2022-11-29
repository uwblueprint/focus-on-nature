import React from "react";
<<<<<<< HEAD
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
=======
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
} from "@chakra-ui/react";
import { WaiverClause } from "../../../../types/AdminTypes";


interface WaiverSectionCardProps {
  clauseIdx: number;
  clauseData: WaiverClause;
  onEditWaiverSection: (clause: WaiverClause, clauseIdx: number) => void;
  onDeleteWaiverSection: (idx: number) => void;
}
const CampCreationDetails = (): JSX.Element => {
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
      <Text textStyle="displayXLarge">Camp Details</Text>
      <Text textStyle="displayLarge" marginTop="32px">Overview</Text>
      
      <Text textStyle="buttonSemiBold" marginTop="32px"> 
        Camp Name{" "}
        <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
      </Text>
      <Input width="575px" height="51px"  marginTop="8px"/>

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Short Description (max 200 characters){" "}
        <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text> 
      </Text>
      <Textarea width="575px" marginTop="8px"/>

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Daily Camp Fee{" "}
        <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
      </Text>
      <InputGroup width="275px" marginTop="8px">
        <InputLeftElement pointerEvents='none'color='black'fontSize='1.2em'>
          $
        </InputLeftElement>
        <Input placeholder='0.00'/>
      </InputGroup>

      <HStack alignItems="end" spacing={4} marginTop="24px">
        <Box>
          <Text textStyle="buttonSemiBold">
            Start Time{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
        
          <HStack spacing="-80px" marginTop="8px">
            <Input placeholder='XX:XX' width="160px" height="52px"/> 
            <Select defaultValue='option1' width="80px" variant='filled' height="52px">
                <option value='option1'>AM</option>
                <option value='option2'>PM</option>
            </Select>
          </HStack>
        </Box>
        
        <Text lineHeight="50px"> to </Text>
        
        <Box>
          <Text textStyle="buttonSemiBold">
            End Time{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
        
          <HStack spacing="-80px" marginTop="8px">
            <Input placeholder='XX:XX' width="160px" height="52px"/> 
            <Select defaultValue='option2' width="80px" variant='filled' height="52px">
                <option value='option1'>AM</option>
                <option value='option2'>PM</option>
            </Select>
          </HStack>
        </Box>
      </HStack>

    <HStack spacing={8} marginTop="24px" marginBottom="24px">
      <Box>
        <Text textStyle="buttonSemiBold">
          Age Range{" "} 
          <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
        </Text>
        <HStack spacing={4} marginTop="8px">
          <Input width="100px" height="52px"/> 
          <Text> to </Text>
          <Input width="100px" height="52px"/> 
        </HStack>
      </Box>

      <Box>
          <Text textStyle="buttonSemiBold">
            Camp Capacity {" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
          <Input width="275px" height="52px" marginTop="8px"/> 
      </Box>
    </HStack>
    
    <Checkbox marginTop="8px">
      <Text textStyle="buttonSemiBold">
        Camp offers early drop-off and late pick-up
      </Text>
    </Checkbox>
    
    
    <HStack alignItems="end" spacing={4} marginTop="24px">
      <Box>
        <Text textStyle="buttonSemiBold"> 
          Earliest Drop-off{" "}
          <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
        </Text>
        
        <HStack spacing="-80px" marginTop="8px">
          <Input placeholder='XX:XX' width="160px" height="52px"/> 

          <Select defaultValue='option1' width="80px"  variant='filled' height="52px">
              <option value='option1'>AM</option>
              <option value='option2'>PM</option>
          </Select>
        </HStack>
      </Box>
      
      <Text lineHeight="50px"> to </Text>
      
      <Box>
        <Text textStyle="buttonSemiBold">
          Latest Pick-up{" "}
          <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
        </Text>
        
        <HStack spacing="-80px" marginTop="8px">
          <Input placeholder='XX:XX' width="160px" height="52px"/> 

          <Select defaultValue='option2' width="80px"  variant='filled' height="52px">
              <option value='option1'>AM</option>
              <option value='option2'>PM</option>
          </Select>
        </HStack>
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
      <Input placeholder='0.00'/>
    </InputGroup>

    <Box width="50%" maxWidth="870px" bg="#8C9196" height="2px" margin="40px 0"/>

    <Divider orientation='horizontal' />
    <Text textStyle="displayLarge">Camp Location</Text>

    <Text textStyle="buttonSemiBold" marginTop="32px">
      Address Line 1{" "}
      <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
    </Text>
    <Input width="575px" height="52px" marginTop="8px"/>

    <Text textStyle="buttonSemiBold" marginTop="24px">
      Address Line 2{" "}
      <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
    </Text>
    <Input width="575px" height="52px" marginTop="8px"/>

    <HStack marginTop="24px">
      <Box>
          <Text textStyle="buttonSemiBold">
            City{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
          <Input width="275px" height="52px" marginTop="8px"/> 
      </Box>
      <Box>
          <Text textStyle="buttonSemiBold">
            Province{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
          <Select defaultValue='option9' width="275px" height="52px" marginTop="8px">
              <option value='option1'>Alberta</option>
              <option value='option2'>British Columbia</option>
              <option value='option3'>Manitoba</option>
              <option value='option4'>New Brunswick</option>
              <option value='option5'>Newfoundland and Labrador</option>
              <option value='option6'>Northwest Territories</option>
              <option value='option7'>Nova Scotia</option>
              <option value='option8'>Nunavut</option>
              <option value='option9'>Ontario</option>
              <option value='option10'>Prince Edward Island</option>
              <option value='option11'>Quebec</option>
              <option value='option12'>Saskatchewan</option>
              <option value='option13'>Yukon</option>
          </Select>
      </Box>
      <Box>
          <Text textStyle="buttonSemiBold">
            Postal Code{" "}
            <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text>
          </Text>
          <Input width="275px" height="52px"/> 
      </Box>
    </HStack>

    <Box  width="50%" maxWidth="870px" bg="#8C9196" height="2px" margin="40px 0"/>

    <Text textStyle="displayLarge">Camp Image</Text>

    <Box marginTop="32px" bg="tomato">image thing</Box>

    </>
>>>>>>> d5c626a (Apply styling and spacing)
  );
};

export default CampCreationDetails;