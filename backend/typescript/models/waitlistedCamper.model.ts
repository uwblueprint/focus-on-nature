import mongoose, { Schema, Document } from "mongoose";

export interface WaitlistedCamper extends Document {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  camp: Schema.Types.ObjectId;
}

const WaitlistedCamperSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  camp: {
    type: Schema.Types.ObjectId,
    ref: "Camp",
    required: true,
  },
});

export default mongoose.model<WaitlistedCamper>(
  "WaitlistedCamper",
  WaitlistedCamperSchema,
);