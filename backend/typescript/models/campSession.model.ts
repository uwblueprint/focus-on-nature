import { Schema, model, Document } from "mongoose";
import { Camper } from "./camper.model";
import { CampSessionStatus } from "../types";

export interface CampSession extends Document {
  id: string;
  camp: Schema.Types.ObjectId;
  campers: (Camper | Schema.Types.ObjectId)[];
  waitlist: Schema.Types.ObjectId[];
  dates: Date[];
  startTime: string;
  endTime: string;
  status: CampSessionStatus;
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
  status: {
    type: String,
    required: true,
    enum: ["Active", "Published", "Draft", "Archived"],
  },
});

export default model<CampSession>("CampSession", CampSessionSchema);
