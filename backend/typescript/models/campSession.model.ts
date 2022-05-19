import { Schema, model, Document } from "mongoose";
import { Camper } from "./camper.model";
import { WaitlistedCamper } from "./waitlistedCamper.model";

export interface CampSession extends Document {
  id: string;
  active: boolean;
  camp: Schema.Types.ObjectId;
  capacity: number;
  campers: (Camper | Schema.Types.ObjectId | string)[];
  dates: Date[];
  endTime: string;
  priceId: string;
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
  capacity: {
    type: Number,
    required: true,
    default: 0,
  },
  campers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Camper",
      },
    ],
    default: [],
    validate: [
      function (this: any, value: any) {
        return value.length <= this.capacity;
      },
      "Camp is at maximum capacity",
    ],
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
