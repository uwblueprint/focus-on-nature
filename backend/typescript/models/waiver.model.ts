import mongoose, { Schema, Document } from "mongoose";

export interface Clause extends Document {
  text: string;
  required: boolean;
}
export interface Waiver extends Document {
  clauses: Clause[];
}

export const ClauseSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    required: true,
  },
});

const WaiverSchema: Schema = new Schema({
  clauses: [ClauseSchema],
});

export default mongoose.model<Waiver>("Waiver", WaiverSchema);
