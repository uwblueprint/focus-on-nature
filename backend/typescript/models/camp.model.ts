import { Schema, model } from "mongoose";
import { BaseCamp } from "./baseCamp.model";
import { Camper } from "./camper.model";
import { WaitlistedCamper } from "./waitlistedCamper.model";

export interface Camp extends BaseCamp {
  baseCamp: Schema.Types.ObjectId;
  campers: (Camper | Schema.Types.ObjectId)[];
  capacity: number;
  waitlist: (WaitlistedCamper | Schema.Types.ObjectId)[];
  dates: Date[];
  startTime: string;
  endTime: string;
  active: boolean;
}

const CampSchema: Schema = new Schema({
  baseCamp: {
    type: Schema.Types.ObjectId,
    ref: "BaseCamp",
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
  capacity: {
    type: Number,
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

export default model<Camp>("Camp", CampSchema);
