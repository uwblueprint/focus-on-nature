import React, { useState } from "react"

import { 
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack,
    ModalBody,
    FormControl,
    FormLabel,
    Select,
    Input,
    FormErrorMessage,
    ModalFooter,
    HStack,
    Button,
    Checkbox,
    Box
} from "@chakra-ui/react"


type AddQuestionModalProps = {
    isOpen : boolean;
    onClose: () => void;
    onSave: () => void;
}


const AddQuestionModal = ({
    isOpen,
    onClose,
    onSave
}: AddQuestionModalProps): React.ReactElement => {
    
    const [question, setQuestion] = useState<string>("");
    const [questionCategory, setQuestionCategory] = useState<string>("PersonalInfo");
    const [questionType, setQuestionType] = useState<string>("Text");
    const [questionDescription, setQuestionDescription] = useState<string>("");
    const [isRequiredQuestion, setIsRequiredQuestion] = useState<boolean>(false);

    const [isQuestionInvalid, setIsQuestionInvalid] = useState<boolean>(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            preserveScrollBarGap
            scrollBehavior="inside"
        >
            <ModalOverlay/>
            <ModalContent
                minH="632px"
                minW="500px"
                backgroundColor="background.grey.100"
                overflow="scroll"
            >
                <ModalHeader
                    paddingTop="60px"
                    marginRight="30px"
                    marginLeft="30px"
                >
                    Add Question
                </ModalHeader>
                <ModalBody
                    marginRight="30px"
                    marginLeft="30px"
                >
                    <VStack align="start">
                        <FormControl isRequired>
                            <FormLabel aria-required>Question Category</FormLabel>
                            <Select 
                                value={questionCategory}
                                onChange={(e) => setQuestionCategory(e.target.value)}
                            >
                                <option value="PersonalInfo">Camper Information</option>
                                <option value="CampSpecific">Emergency Contact</option>
                                <option value="EmergencyContact">Camp Specific Information</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired isInvalid={isQuestionInvalid}>
                            <FormLabel aria-required marginTop="14px">Question</FormLabel>
                            <Input 
                                placeholder="Enter question here..."
                                value={question}
                                onChange = {(e) => setQuestion(e.target.value)}
                            />
                            {isQuestionInvalid && <FormErrorMessage>You must enter a question</FormErrorMessage>}
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel aria-required marginTop="14px">Question Type</FormLabel>
                            <Select 
                                value={questionType}
                                onChange = {(e) => setQuestionType(e.target.value)}
                            >
                                <option value="Text">Short answer</option>
                                <option value="MultipleChoice">Multiple choice</option>
                                <option value="Multiselect">Checkbox</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel marginTop="14px">Question Description</FormLabel>
                            <Input 
                                placeholder="Enter description here..." 
                                value={questionDescription}
                                onChange={(e) => setQuestionDescription(e.target.value)}
                            />
                        </FormControl>

                        <Box paddingTop="14px">
                            <Checkbox 
                                isChecked={isRequiredQuestion}
                                onChange={(e) => setIsRequiredQuestion(e.target.checked)}
                            >
                                Required question
                            </Checkbox>
                        </Box>

                    </VStack>
                </ModalBody>

                <ModalFooter 
                    background="background.white.100"
                    paddingLeft="0px"
                >
                    <HStack>
                        <Button onClick={onClose} variant="cancelGreenOutline">Cancel</Button>
                        <Button variant="saveGreenFilled" >Save question</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddQuestionModal