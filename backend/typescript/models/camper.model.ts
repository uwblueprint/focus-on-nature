import mongoose, { Schema, Document } from "mongoose";
import { DropOffType } from "../types";

export interface Camper extends Document {
  id: string;
  camp: Schema.Types.ObjectId;
  formResponses: Map<string, string>;
  dropOffType: DropOffType;
  registrationDate: Date;
  hasPaid: boolean;
  chargeId: number;
}

const CamperSchema: Schema = new Schema({
  camp: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  formResponses: {
    type: Map,
    of: String,
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
