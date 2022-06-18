import mongoose, { Schema, Document } from "mongoose";

export interface Fees extends Document {
  id: string;
  dropoffFee: number;
  pickUpFee: number;
}

const FeesSchema: Schema = new Schema({
  dropoffFee: {
    type: Number,
    required: true,
  },
  pickUpFee: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<Fees>("Fees", FeesSchema);
