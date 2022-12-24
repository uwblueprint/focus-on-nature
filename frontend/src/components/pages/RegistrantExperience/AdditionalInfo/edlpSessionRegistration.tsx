import React, { useState, Dispatch, SetStateAction } from "react";
import { AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Text, Box, Table, Thead, Tr, Th, Td, Tbody, Select, useForceUpdate} from '@chakra-ui/react'
import { formatAMPM, getFormattedDateString, getFormattedSingleDateString } from "../../../../utils/CampUtils";
import { CampResponse, CampSession } from '../../../../types/CampsTypes';

type EDLPSessionRegistrationProps = {
    sessionNumber: number
    camp: CampResponse
    numberOfCampers: number,
    edlpCost: number
    session: CampSession
    edlpChoices: EdlpChoice[][];
    totalEdlpFees: number;
    sessionEdlpFees: number[];
    setEdlpChoices:  Dispatch<SetStateAction<EdlpChoice[][]>>;
    setTotalEdlpFees: Dispatch<SetStateAction<number>>;
    setSessionEdlpFees: Dispatch<SetStateAction<number[]>>;
  };

export type EdlpChoice = {
    date:string;
    edlp:string[]
}

const computeIntervals = (campTime: string, edlpTime: string, isPickup: boolean): string[] => {

    const a = [];
    const startValue = edlpTime;
    const endValue = campTime;
    const intervalValue = 30;
    let startDate = new Date(`1/1/2022 ${startValue}`);
    const endDate = new Date(`1/1/2022 ${endValue}`);
    
    const offset = intervalValue * 1000 * 60;
    
    if (isPickup)
        while(startDate > endDate) {
            a.push(startDate.toLocaleString("en-US", { 
                hour: "numeric", 
                minute: "2-digit",
                hour12: true 
            }));
            startDate = new Date(startDate.getTime() - offset);
        }

    while(startDate < endDate) {
        a.push(startDate.toLocaleString("en-US", { 
            hour: "numeric", 
            minute: "2-digit",
            hour12: true 
        }));
        startDate = new Date(startDate.getTime() + offset);
    }
    
    return a
} 

const EDLPSessionRegistration = ({
    sessionNumber,
    camp,
    numberOfCampers,
    edlpCost,
    session,
    edlpChoices,
    totalEdlpFees,
    sessionEdlpFees,
    setEdlpChoices,
    setTotalEdlpFees,
    setSessionEdlpFees
    }: EDLPSessionRegistrationProps): React.ReactElement => {
    
    const matrix = new Array(session.dates.length).fill(0).map(() => new Array(2).fill(0));
    const [edlpDayFees,setEdlpDayFees] = useState<number[][]>(matrix);

    const [, updateState] = React.useState<any>();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>, date: string, day:number, index:number) => {
        edlpDayFees[day][index] = Number(event.target.value) * edlpCost
        
        const sessionTotal = edlpDayFees.reduce(function(a,b) { return a.concat(b) }).reduce(function(a,b) { return a + b })
        
        const temp = sessionEdlpFees
        temp[sessionNumber-1] = sessionTotal
        setSessionEdlpFees(temp)
        
        setTotalEdlpFees(sessionEdlpFees.reduce(function(a,b) { return a + b }) * numberOfCampers)

        console.log(sessionNumber-1, day, date)
        const temp2 = edlpChoices
        temp2[sessionNumber-1][day].date = date
        temp2[sessionNumber-1][day].edlp[index] = event.target.options[Number(event.target.value)].text
        setEdlpChoices(temp2)

        forceUpdate();
    }

    
    return (
        <AccordionItem border="none" marginTop="32px" bg="#FBFBFB" borderRadius="10px" boxShadow="0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)">
            <h2>
                <AccordionButton
                    bg="white" 
                    padding="32px 80px" 
                    borderRadius="10px"
                    _expanded={{borderBottomRadius:"0", borderBottom:"1px solid #EEEFF1"}}
                >
                    <Box as="span" flex='1' textAlign='left'>
                    <Text as='span' textStyle="displayMediumBold">Session {sessionNumber}:{" "}</Text>
                    <Text as='span' textStyle="displayMediumRegular">{getFormattedDateString(session.dates)}</Text>
                    <Text textStyle="displayRegular">{formatAMPM(camp.startTime)} - {formatAMPM(camp.endTime)}</Text>
                    </Box>
                    <AccordionIcon boxSize={10}/>
                </AccordionButton>
            </h2>

            <AccordionPanel padding="0">
                <Box padding="32px 80px">
                    <Table
                    variant="simple"
                    colorScheme="blackAlpha"
                    background="#FBFBFB"
                    size='sm'
                    >
                        <Thead>
                            <Tr textAlign="left">
                                <Td color="text.default.100" border="none">Date</Td>
                                <Td color="text.default.100" border="none">Early Dropoff</Td>
                                <Td color="text.default.100" border="none">Late Pickup</Td>
                                <Td color="text.default.100" border="none">Cost/Child</Td>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {session.dates.map((date: string) => {
                                
                                return (
                                    <Tr key={100*session.dates.indexOf(date)}>
                                        <Td border="none" textStyle="buttonRegular">
                                            {getFormattedSingleDateString(date)}
                                        </Td>
                                        <Td border="none">
                                            <Select 
                                            width="120px" 
                                            defaultValue={0}
                                            onChange={(event) => {handleSelect(event,date,session.dates.indexOf(date),0);}}>
                                                <option value={0}>-</option>
                                                {computeIntervals(camp.startTime, camp.earlyDropoff, false).map((edInterval: string) => {
                                                    const intervals = computeIntervals(camp.startTime, camp.earlyDropoff, false)

                                                    return (<option
                                                        key={sessionNumber}
                                                        value={intervals.indexOf(edInterval)+1}>
                                                            {edInterval}
                                                        </option>)
                                                })}
                                            </Select>
                                        </Td>
                                        <Td border="none">
                                            <Select 
                                            width="120px" 
                                            defaultValue={0}
                                            onChange={(event) => {handleSelect(event,date,session.dates.indexOf(date),1);}}>
                                                <option value={0}>-</option>
                                                {computeIntervals(camp.endTime, camp.latePickup, true).map((edInterval: string) => {
                                                    return (<option
                                                        key={sessionNumber} 
                                                        value={1}>
                                                            {edInterval}
                                                        </option>)
                                                })}
                                            </Select>
                                        </Td>
                                        <Td border="none">
                                            ${edlpDayFees[session.dates.indexOf(date)][0]+edlpDayFees[session.dates.indexOf(date)][1]}
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </Box>
                <Box
                    bg="white" 
                    padding="32px 80px" 
                    borderBottomRadius="10px"
                >
                    <Text as='span' textStyle="displayMediumBold">Total Cost:{" "}</Text>
                    <Text as='span' textStyle="displayMediumRegular">${
                        sessionEdlpFees[sessionNumber-1] 
                    } per camper</Text>
                </Box>
            </AccordionPanel>
        </AccordionItem>
    )
}

export default EDLPSessionRegistration