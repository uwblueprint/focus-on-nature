import React, { useState } from "react";

import { 
    Checkbox,
    HStack,
    IconButton,
    Input,
    Radio,
    VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const QuestionOptionSection = ({
    questionType,
    setOptionsArray,
}: {
    questionType: string;
    setOptionsArray: (options: Array<string>) => void;
}): React.ReactElement => {
  
    interface Option {
      option: string;
    }
  
    const key: keyof Option = "option";
  
    const [options, setOptions] = useState<Array<Option>>([{ option: "" }]);
  
    const handleFormChange = (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const data = [...options];
      data[index][key] = e.target.value;
      setOptions(data);
      const optionsArray = data.map((option) => option.option);
      setOptionsArray(optionsArray);
    };
  
    const removeField = (index: number) => {
      const data = [...options];
      data.splice(index, 1);
      setOptions(data);
      const optionsArray = data.map((option) => option.option);
      setOptionsArray(optionsArray);
    };
  
    const addInputField = () => {
      const newField = { option: "" };
      setOptions([...options, newField]);
    };
  
    return (
      <VStack minW="100%" key="options_stack">
        {options.map((option, index) => {
          return (
            <HStack
              key={`${option}_${index}_stack`}
              minW="100%"
              align="start"
              alignItems="center"
            >
              {questionType === "MultipleChoice" && (
                <Radio size="lg" key={`${option}_${index}_radio`} isReadOnly />
              )}
  
              {questionType === "Multiselect" && (
                <Checkbox
                  isReadOnly
                  key={`${option}_${index}_checkbox`}
                  size="lg"
                />
              )}
  
              <Input
                key={`${option}_${index}_input`}
                onChange={(e) => handleFormChange(index, e)}
                value={option.option}
              />
  
              <IconButton
                icon={<DeleteIcon />}
                aria-label="remove option"
                variant="ghost"
                key={`${option}_${index}_delete`}
                maxW="15px"
                onClick={() => removeField(index)}
                isDisabled={options.length <= 1}
              />
            </HStack>
          );
        })}
        <IconButton
          aria-label="add new option"
          icon={<AddIcon />}
          minW="100%"
          maxH="30px"
          onClick={addInputField}
        />
      </VStack>
    );
  };

export default QuestionOptionSection;