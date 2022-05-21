import mongoose, { Schema, Document } from "mongoose";

export interface WaitlistedCamper extends Document {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  status: string;
  campSession: Schema.Types.ObjectId;
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
  status: {
    type: String,
    enum: ["NOT REGISTERED", "REGISTRATION FORM SENT", "REGISTERED"],
    default: "NOT REGISTERED",
    required: true,
  },
  campSession: {
    type: Schema.Types.ObjectId,
    ref: "CampSession",
    required: true,
  },
});

export default mongoose.model<WaitlistedCamper>(
  "WaitlistedCamper",
  WaitlistedCamperSchema,
);
