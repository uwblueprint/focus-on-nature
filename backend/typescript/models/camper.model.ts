import mongoose, { Schema, Document } from "mongoose";
import { FormResponse } from "./formResponse.model";
import { DropOffType } from "../types";

export interface Camper extends Document {
  id: string;
  camp: Schema.Types.ObjectId;
  formResponses: FormResponse[] | Schema.Types.ObjectId[];
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
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "FormResponse",
      },
    ],
    default: [],
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
