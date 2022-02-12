import { Schema, model, PopulatedDoc } from "mongoose";
import { AbstractCamp } from "./abstractCamp.model";
import { CamperDTO } from "../types";

export interface Camp extends AbstractCamp {
  baseCamp: Schema.Types.ObjectId;
  campers: PopulatedDoc<CamperDTO>[];
  waitlist: Schema.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  active: boolean;
}

const CampSchema: Schema = new Schema({
  baseCamp: {
    type: Schema.Types.ObjectId,
    ref: "Camp",
    required: true,
  },
  campers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Camper",
      required: true,
      default: [],
    },
  ],
  waitlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Camper",
      required: true,
      default: [],
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

export default model<Camp>("Camp", CampSchema);
