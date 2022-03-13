import mongoose, { Schema, Document } from "mongoose";

export interface Camper extends Document {
  id: string;
  camp: Schema.Types.ObjectId;
  formResponses: {
    [key: string]: string;
  };
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
    type: Schema.Types.Mixed,
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
    type: Number,
    required: true,
  },
});

export default mongoose.model<Camper>("Camper", CamperSchema);
