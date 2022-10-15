import React from "react";

import { Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon} from "@chakra-ui/icons";
import AddQuestionModal from "../common/formQuestions/AddQuestionModal";

const GlobalFormsPage = (): React.ReactElement => {

  const { 
    isOpen : isAddQuestionOpen,
    onOpen: onAddQuestionOpen,
    onClose : onAddQuestionClose 
  } = useDisclosure();


  return (
    <div>
      <h2>Global Forms Page</h2>
      <Button 
        leftIcon={<AddIcon color="text.white.100"/>} 
        variant="addQuestion"
        onClick={onAddQuestionOpen}
      >
          Add Question
      </Button>

      <AddQuestionModal 
        isOpen={isAddQuestionOpen}
        onClose={onAddQuestionClose}
        onSave={() => console.log("save question")}
      />
    </div>
  );
};

export default GlobalFormsPage;
