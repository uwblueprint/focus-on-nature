import React from 'react';

import { Box, Grid, GridItem, Text } from '@chakra-ui/react';

import { FormQuestion } from '../../../../types/CampsTypes';
import { getTextFromQuestionType } from '../../../../utils/CampUtils';
import RequiredTag from '../../../common/camps/RequiredTag';

interface AdditionalQuestionCardProps {
    question: FormQuestion;
    questionNumber: number;
}
 
const AdditionalQuestionCard= ({
    question,
    questionNumber,
}: AdditionalQuestionCardProps): React.ReactElement => {

    return (
        <Box 
            backgroundColor="background.grey.200" 
            height="50px"
            marginBottom="10"
            borderRadius="5"
        >
            <Grid
                templateColumns="repeat(10, 1fr)"
                templateRows="repeat(1, 1fr)"
                height="80px"
                backgroundColor="background.grey.200"
                borderRadius="2px"
                alignItems="center"
            >
                <GridItem rowSpan={1} colSpan={1} paddingLeft="40px">
                    <Text fontSize="2xl" color="primary.green.100">{questionNumber}.</Text>
                </GridItem>
                <GridItem rowSpan={1} colSpan={8} paddingLeft="10px">
                    <Text fontSize="large">{question.question}</Text>
                    <Text fontSize="sm" color="text.grey.100">{getTextFromQuestionType(question.type)}</Text>
                </GridItem>
                <GridItem colSpan={1}>
                    <RequiredTag/>
                </GridItem>
            </Grid>
        </Box>
    );
}
 
export default AdditionalQuestionCard;