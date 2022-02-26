import mongoose, { Schema, Document } from "mongoose";
import { DropOffType } from "../types";

export interface Camper extends Document {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  camps: Schema.Types.ObjectId[];
  hasCamera: boolean;
  hasLaptop: boolean;
  allergies: string;
  additionalDetails: string;
  dropOffType: DropOffType;
  registrationDate: Date;
  hasPaid: boolean;
  chargeId: number;
}

const CamperSchema: Schema = new Schema({
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
    required: true,
  },
  hasCamera: {
    type: Boolean,
    required: true,
  },
  hasLaptop: {
    type: Boolean,
    required: true,
  },
  allergies: {
    type: String,
  },
  additionalDetails: {
    type: String,
  },
  dropOffType: {
    type: String,
    enum: ["EarlyDropOff", "LatePickUp"],
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  hasPaid: {
    type: Boolean,
    required: true,
  },
  chargeId: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<Camper>("Camper", CamperSchema);
