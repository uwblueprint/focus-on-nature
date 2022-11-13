import React from 'react';

import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Text} from '@chakra-ui/react';
import { FormQuestion } from '../../../../types/CampsTypes';
import FixedQuestions from './FixedQuestions'
import FixedQuestionCard from './FixedQuestionCard';
import AdditionalQuestionCard from './AdditionalQuestionCard';


const CamperInfoAccordion = ({
    camperInfoQuestions
}: {
    camperInfoQuestions : Array<FormQuestion>
}) : React.ReactElement => {

    console.log(camperInfoQuestions)

    return (
        <AccordionItem border="none">
            <AccordionButton borderRadius="20px" bg="primary.green.100" _hover={{bg: "primary.green.100"}}>
                <Box flex="1" textAlign="left">
                    <Text color="text.white.100" textStyle="displayLarge" p={2}>
                        Camper Information
                    </Text>
                </Box>
                <AccordionIcon color="white"/>
            </AccordionButton>

            <AccordionPanel>
                {FixedQuestions.fixedCamperInfoQuestions.map((question, index) => (
                        <FixedQuestionCard 
                            question={question}
                            questionNumber={index + 1}
                            key={`${question.question}_${index + 1}`}
                        />
                    ))}
                {camperInfoQuestions.map((question, index) => (
                        <AdditionalQuestionCard 
                            question={question}
                            questionNumber={index + 1 + FixedQuestions.fixedCamperInfoQuestions.length}
                            key={`${question.question}_${index + FixedQuestions.fixedCamperInfoQuestions.length + 1}`}
                        />
                    ))}
            </AccordionPanel>
        </AccordionItem>
    );
}

export default CamperInfoAccordion;