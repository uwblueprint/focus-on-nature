import { Schema, Document, model } from "mongoose";
import { CampSession } from "./campSession.model";
import { FormQuestion } from "./formQuestion.model";

export interface Camp extends Document {
  id: string;
  ageLower: number;
  ageUpper: number;
  capacity: number;
  name: string;
  description: string;
  location: string;
  fee: number;
  formQuestions: (Schema.Types.ObjectId | FormQuestion)[];
  campSessions: (Schema.Types.ObjectId | CampSession)[];
  fileName?: string;
}

const CampSchema: Schema = new Schema({
  ageLower: {
    type: Number,
    required: true,
  },
  ageUpper: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  formQuestions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "FormQuestion",
      },
    ],
    required: true,
  },
  campSessions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "CampSession",
      },
    ],
  },
  fileName: {
    type: String,
    required: false,
  },
});

export default model<Camp>("Camp", CampSchema);
