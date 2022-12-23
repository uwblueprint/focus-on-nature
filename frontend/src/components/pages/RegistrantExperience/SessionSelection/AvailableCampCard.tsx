import React, { useState } from "react";
import { Box, Text, Grid, GridItem, Center, Show } from "@chakra-ui/react";
import { CampSession } from "../../../../types/CampsTypes";

const AvailableCampCard = ({
  fee,
  startTime,
  endTime,
  campData,
  handleClick,
  disabled,
}: {
  fee: number,
  startTime: string,
  endTime: string,
  campData: CampSession,
  handleClick: (sessionID:string, sessionType:string) => void,
  disabled: boolean,
}): React.ReactElement => {
  const [backgroundColour, setbackgroundColour] = useState('white');
  
  const handleCardClick = () => {
    if (!disabled) {
      if (backgroundColour === 'green.100') {
        setbackgroundColour('white');
      } else {
        setbackgroundColour('green.100');
      }
      handleClick(campData.id, "Available");
    }
  }

  const getCampSessionDate = () => {
    const startDate = new Date(campData.dates[0]);
    const endDate = new Date(campData.dates[campData.dates.length - 1]);
    return `${startDate.toLocaleString("default", {month: "short",})} ${startDate.getDay()} - ${endDate.toLocaleString("default", {month: "short",})} ${endDate.getDay()}, ${endDate.getFullYear()}`; 
  }

  return (
    <Box 
      bg={backgroundColour}
      width={{ sm:40, md:48, lg:48 }}
      height={{ sm:36, md:28, lg:28 }}
      mt={2}
      px={1} 
      py={3}
      borderColor='green'
      borderWidth='1px'
      borderRadius='md'
      onClick={() => {handleCardClick()}} 
      _hover={{
        background: (backgroundColour === 'green.100') ? 'green.100' : 'RGBA(0, 0, 0, 0.16)'
      }}
      cursor={ disabled ? 'not-allowed' : 'pointer'}
      opacity= { disabled ? '0.5' : '1'}
    >
      <Grid templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)'}}>
        <GridItem>
          <Text fontSize='sm' color='green'>Available</Text>
        </GridItem>
        <GridItem mb={{sm:1, md: 2, lg: 2}}>
          <Text fontSize='sm' as='b' color='black'>{campData.capacity - campData.campers.length} spots left!</Text>
        </GridItem>
        <GridItem colSpan={{md:2, lg:2}} mb={{sm:1, md: 2, lg: 2}}>
          <Show breakpoint='(min-width: 768px)'>
            <Center>
              <Text color='black' fontSize='md'>{getCampSessionDate()}</Text>
            </Center>
          </Show>
          <Show breakpoint='(max-width: 767px)'>
            <Text color='black' fontSize='md'>{getCampSessionDate()}</Text>
          </Show>
        </GridItem>
        <Show breakpoint='(min-width: 768px)'>
          <GridItem colSpan={2}>
            <Center>
              <Text fontSize='xs' color='black'>{startTime}AM - {endTime}PM · ${fee}</Text>
            </Center>
          </GridItem>
        </Show>
        <Show breakpoint='(max-width: 767px)'>
          <GridItem mb={1}>
            <Text fontSize='xs' color='black'>{startTime}AM - {endTime}PM</Text>
          </GridItem>
        </Show>
        <Show breakpoint='(max-width: 767px)'>
          <GridItem>
            <Text fontSize='xs' color='black'>${fee}</Text>
          </GridItem>
        </Show>
      </Grid>
    </Box>
  )
};

export default AvailableCampCard;
