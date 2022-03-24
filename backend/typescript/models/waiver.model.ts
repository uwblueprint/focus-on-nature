import mongoose, { Schema, Document } from "mongoose";

export interface Clause extends Document {
  text: string;
  required: boolean;
}
export interface Waiver extends Document {
  clauses: Clause[];
}

const WaiverSchema: Schema = new Schema({
  clauses: [{
    text: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
    },
  }],
});

export default mongoose.model<Waiver>("Waiver", WaiverSchema);
