import React from "react";
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
const CampCreationForm = (): JSX.Element => {
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
      <Text textStyle="displayLarge">Overview</Text>
    
        <Text textStyle="buttonSemiBold"> Camp Name <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
      <Input placeholder='Basic usage' width="575px" height="52px"/>

      <Text textStyle="buttonSemiBold"> Short Description (max 200 characters) <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text> </Text>
      <Textarea placeholder='Here is a sample placeholder' width="575px"/>

      <Text textStyle="buttonSemiBold"> Daily Camp Fee <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
      <InputGroup width="275px">
        <InputLeftElement
        pointerEvents='none'
        color='black'
        fontSize='1.2em'
        >$</InputLeftElement>
        <Input defaultValue='0.00'/>
    </InputGroup>

    <HStack alignItems="end" spacing={8}>
    <Box>
    <Text textStyle="buttonSemiBold"> Start Time <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <HStack spacing="-80px">
        <Input placeholder='XX:XX' width="160px" height="52px"/> 

        <Select defaultValue='option1' width="80px"  variant='filled' height="52px">
            <option value='option1'>AM</option>
            <option value='option2'>PM</option>
        </Select>
        </HStack>
    </Box>
    <Text lineHeight="50px"> to </Text>
    <Box>
    <Text textStyle="buttonSemiBold"> End Time <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <HStack spacing="-80px">
        <Input placeholder='XX:XX' width="160px" height="52px"/> 

        <Select defaultValue='option2' width="80px"  variant='filled' height="52px">
            <option value='option1'>AM</option>
            <option value='option2'>PM</option>
        </Select>
        </HStack>
    </Box>
    </HStack>

    <HStack spacing={8}>
    <Box>
        <Text textStyle="buttonSemiBold"> Age Range <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <HStack spacing={4}>
        <Input width="100px" height="52px"/> 
        <Text> to </Text>
        <Input width="100px" height="52px"/> 
        </HStack>
    </Box>

    <Box>
        <Text textStyle="buttonSemiBold"> Camp Capacity <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <Input width="275px" height="52px"/> 
    </Box>
    </HStack>
    
    <Checkbox><Text textStyle="buttonSemiBold"> Camp offers early drop-off and late pick-up</Text></Checkbox>
    
    
    <HStack alignItems="end" spacing={8}>
    <Box>
    <Text textStyle="buttonSemiBold"> Earliest Drop-off <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <HStack spacing="-80px">
        <Input placeholder='XX:XX' width="160px" height="52px"/> 

        <Select defaultValue='option1' width="80px"  variant='filled' height="52px">
            <option value='option1'>AM</option>
            <option value='option2'>PM</option>
        </Select>
        </HStack>
    </Box>
    <Text lineHeight="50px"> to </Text>
    <Box>
    <Text textStyle="buttonSemiBold"> Latest Pick-up <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <HStack spacing="-80px">
        <Input placeholder='XX:XX' width="160px" height="52px"/> 

        <Select defaultValue='option2' width="80px"  variant='filled' height="52px">
            <option value='option1'>AM</option>
            <option value='option2'>PM</option>
        </Select>
        </HStack>
    </Box>
    </HStack>

    <Text textStyle="buttonSemiBold"> EDLP Price Per 30 Minutes <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text> </Text>
    <InputGroup width="275px">
        <InputLeftElement
        pointerEvents='none'
        color='black'
        fontSize='1.2em'
        >$</InputLeftElement>
        <Input defaultValue='0.00'/>
    </InputGroup>

    <Box  width="50%" backgroundColor="black" height="2px" />

    <Text textStyle="displayLarge">Camp Location</Text>
    <Text textStyle="buttonSemiBold"> Address Line 1 <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
    <Input placeholder='Basic usage' width="575px" height="52px"/>

    <Text textStyle="buttonSemiBold"> Address Line 2 </Text>
    <Input placeholder='Basic usage' width="575px" height="52px"/>

    <HStack>
    <Box>
        <Text textStyle="buttonSemiBold"> City <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <Input width="275px" height="52px"/> 
    </Box>
    <Box>
        <Text textStyle="buttonSemiBold"> Province <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <Select  width="275px"   height="52px">
            <option value='option1'>AM</option>
            <option value='option2'>PM</option>
        </Select>
    </Box>
    <Box>
        <Text textStyle="buttonSemiBold"> Postal Code <Text textStyle="buttonSemiBold" display="inline" color="red">*</Text></Text>
        <Input width="275px" height="52px"/> 
    </Box>
    </HStack>

    <Box  width="50%" backgroundColor="black" height="2px" />

    

    </>
  );
};

export default CampCreationForm;