import mongoose, { Schema, Document } from "mongoose";

export interface Waiver extends Document {
  clauses: {
    text: string;
    required: boolean;
 }[]
}

const WaiverSchema: Schema = new Schema({
  clauses: [
    {
      text: {
        type: String,
        required: true,
      },
      required: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

export default mongoose.model<Waiver>("Waiver", WaiverSchema);
