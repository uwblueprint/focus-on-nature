import { Schema, Document, model } from "mongoose";
import { CampSession } from "./campSession.model";
import { FormQuestion } from "./formQuestion.model";

export interface Camp extends Document {
  id: string;
  ageLower: number;
  ageUpper: number;
  capacity: number;
  campSessions: (Schema.Types.ObjectId | CampSession)[];
  description: string;
  fee: number;
  fileName?: string;
  formQuestions: (Schema.Types.ObjectId | FormQuestion)[];
  location: string;
  name: string;
  productId: string;
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
  campSessions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "CampSession",
      },
    ],
  },
  description: {
    type: String,
  },
  fee: {
    type: Number,
    required: true,
  },
  fileName: {
    type: String,
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
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
  },
});

export default model<Camp>("Camp", CampSchema);
