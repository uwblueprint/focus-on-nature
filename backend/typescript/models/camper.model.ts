import mongoose, { Schema, Document } from "mongoose";

export interface Camper extends Document {
  id: string;
  campSession: Schema.Types.ObjectId;
  formResponses: {
    [key: string]: string;
  };
  registrationDate: Date;
  hasPaid: boolean;
  chargeId: string;
}

const CamperSchema: Schema = new Schema({
  campSession: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CampSession",
  },
  formResponses: {
    type: Map,
    of: String,
    required: true,
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
    type: String,
    required: true,
  },
});

export default mongoose.model<Camper>("Camper", CamperSchema);
