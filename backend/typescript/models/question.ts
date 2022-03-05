import mongoose, { Schema, Document } from "mongoose";

import { QuestionType } from "../types";

export interface Question extends Document {
  id: string;
  questionType: QuestionType;
  question: string;
  questionRequired: boolean;
  description?: string;
  options?: string[];
}

const QuestionSchema: Schema = new Schema({
  questionType: {
    type: String,
    required: true,
    enum: ["Text", "Multiple Choice", "Multiselect"],
  },
  question: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    required: true,
  },
  desciption: {
    type: String,
    required: false,
  },
  options: {
    type: String,
    required: false,
  },
});

export default mongoose.model<Question>("Question", QuestionSchema);
