import mongoose, { Schema, Document } from "mongoose";

export interface Waiver extends Document {
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  f: string;
}

const WaiverSchema: Schema = new Schema({
  a: {
    type: String,
    required: true,
  },
  b: {
    type: String,
    required: true,
  },
  c: {
    type: String,
    required: true,
  },
  d: {
    type: String,
    required: true,
  },
  e: {
    type: String,
    required: false,
  },
  f: {
    type: String,
    required: false,
  },
});

export default mongoose.model<Waiver>("Waiver", WaiverSchema);
