import { Schema, Document, model } from "mongoose";

export interface BaseCamp extends Document {
  id: string;
  ageLower: number;
  ageUpper: number;
  name: string;
  description: string;
  location: string;
  fee: number;
  camperInfo: string[];
  camps: Schema.Types.ObjectId[];
}

const BaseCampSchema: Schema = new Schema({
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
  camperInfo: {
    type: [String],
    default: [],
  },
  camps: [{ type: Schema.Types.ObjectId, ref: "Camp" }],
});

export default model<BaseCamp>("BaseCamp", BaseCampSchema);
