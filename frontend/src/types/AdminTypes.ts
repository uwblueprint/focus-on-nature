export type WaiverClause = {
  text: string;
  required: boolean;
};

export type Waiver = {
  clauses: WaiverClause[];
};

export type UpdateWaiverRequest = {
  clauses: WaiverClause[];
};
import { FormQuestion } from "./CampsTypes";


export type FormTemplate = {
    formQuestions: [FormQuestion];
}

// export type 
