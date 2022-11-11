import { FormQuestion } from "./CampsTypes";

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

export type FormTemplate = {
  formQuestions: [FormQuestion];
};
