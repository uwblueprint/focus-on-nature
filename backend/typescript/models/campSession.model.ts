import { Schema, model, Document } from "mongoose";
import { Camper } from "./camper.model";
import { WaitlistedCamper } from "./waitlistedCamper.model";

export interface CampSession extends Document {
  id: string;
  camp: Schema.Types.ObjectId;
  capacity: number;
  campers: (Camper | Schema.Types.ObjectId | string)[];
  dates: Date[];
  campPriceId: string;
  dropoffPriceId: string;
  pickUpPriceId: string;
  waitlist: (WaitlistedCamper | Schema.Types.ObjectId)[];
}

const CampSessionSchema: Schema = new Schema({
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
      "Capacity error - tried to register for more spots than available",
    ],
  },
  dates: {
    type: [Date],
    required: true,
  },
  campPriceId: {
    type: String,
  },
  dropoffPriceId: {
    type: String,
  },
  pickUpPriceId: {
    type: String,
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
