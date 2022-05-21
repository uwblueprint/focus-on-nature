import mongoose, { Schema, Document } from "mongoose";

import { QuestionType } from "../types";

export interface FormQuestion extends Document {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  description?: string;
  options?: string[];
  answers?: string[]; 
}

const FormQuestionSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["Text", "MultipleChoice", "Multiselect"],
  },
  question: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
  },
  options: {
    type: [String],
  },
  answers: {
    type: [String], 
  }, 
});

export default mongoose.model<FormQuestion>("FormQuestion", FormQuestionSchema);

// add one field that maps the required questions to the field that stores the responses on the camper