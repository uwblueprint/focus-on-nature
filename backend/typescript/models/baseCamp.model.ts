import { Schema, Document, model } from "mongoose";

export interface BaseCamp extends Document {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  fee: number;
  camperInfo: string[];
  camps: Schema.Types.ObjectId[];
}

const BaseCampSchema: Schema = new Schema({
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
  capacity: {
    type: Number,
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
