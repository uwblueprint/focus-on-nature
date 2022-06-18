import mongoose, { Schema, Document } from "mongoose";
import { WaitlistedCamperStatus } from "../types";

export interface WaitlistedCamper extends Document {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  status: WaitlistedCamperStatus;
  campSession: Schema.Types.ObjectId;
  linkExpiry?: Date;
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
    enum: ["NotRegistered", "RegistrationFormSent", "Registered"],
    default: "NotRegistered",
    required: true,
  },
  campSession: {
    type: Schema.Types.ObjectId,
    ref: "CampSession",
    required: true,
  },
  linkExpiry: {
    type: Date,
  },
});

export default mongoose.model<WaitlistedCamper>(
  "WaitlistedCamper",
  WaitlistedCamperSchema,
);
