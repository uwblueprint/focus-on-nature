import { Schema, model } from "mongoose";
import { Camp } from "./camp.model";
import { Camper } from "./camper.model";

export interface CampSession extends Camp {
  camp: Schema.Types.ObjectId;
  campers: (Camper | Schema.Types.ObjectId)[];
  capacity: number;
  waitlist: Schema.Types.ObjectId[];
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

export default model<CampSession>("CampSession", CampSessionSchema);
