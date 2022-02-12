import mongoose, { Schema, Document } from "mongoose";

export interface WaitlistedCamper extends Document {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  parentName: string;
  contactEmail: string;
  contactNumber: string;
  camps: Schema.Types.ObjectId;
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
  parentName: {
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
  camps: {
    type: [{ type: Schema.Types.ObjectId, ref: "Camp" }],
    default: [],
  }
});

export default mongoose.model<WaitlistedCamper>("WaitlistedCamper", WaitlistedCamperSchema);
