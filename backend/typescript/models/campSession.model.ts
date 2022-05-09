import { Schema, model, Document } from "mongoose";
import { Camper } from "./camper.model";
import { WaitlistedCamper } from "./waitlistedCamper.model";

export interface CampSession extends Document {
  id: string;
  active: boolean;
  camp: Schema.Types.ObjectId;
  campers: (Camper | Schema.Types.ObjectId)[];
  dates: Date[];
  endTime: string;
  priceId: string;
  dropOffPriceId: string;
  pickUpPriceId: string;
  startTime: string;
  waitlist: (WaitlistedCamper | Schema.Types.ObjectId)[];
}

const CampSessionSchema: Schema = new Schema({
  active: {
    type: Boolean,
    required: true,
  },
  camp: {
    type: Schema.Types.ObjectId,
    ref: "Camp",
    required: true,
  },
  campers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Camper",
      },
    ],
    default: [],
  },
  dates: {
    type: [Date],
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  priceId: {
    type: String,
  },
  dropOffPriceId: {
    type: String,
  },
  pickUpPriceId: {
    type: String,
  },
  startTime: {
    type: String,
    required: true,
  },
  waitlist: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "WaitlistedCamper",
      },
    ],
    default: [],
  },
});

export default model<CampSession>("CampSession", CampSessionSchema);
