import { Schema, Document, model } from "mongoose";

export interface Camp extends Document {
  id: string;
  ageLower: number;
  ageUpper: number;
  name: string;
  description: string;
  location: string;
  fee: number;
  formQuestions: Schema.Types.ObjectId[];
  campSessions: Schema.Types.ObjectId[];
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
});

export default model<Camp>("Camp", CampSchema);
