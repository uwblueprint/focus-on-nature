import { Schema, model, Document } from "mongoose";
import { Camper } from "./camper.model";
import { WaitlistedCamper } from "./waitlistedCamper.model";

export interface CampSession extends Document {
  id: string;
  camp: Schema.Types.ObjectId;
  campers: (Camper | Schema.Types.ObjectId)[];
  waitlist: (WaitlistedCamper | Schema.Types.ObjectId)[];
  dates: Date[];
  startTime: string;
  endTime: string;
  active: boolean;
}

const CampSessionSchema: Schema = new Schema({
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
  waitlist: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "WaitlistedCamper",
      },
    ],
    default: [],
  },
  dates: {
    type: [Date],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

export default model<CampSession>("CampSession", CampSessionSchema);
