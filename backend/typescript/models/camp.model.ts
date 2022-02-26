import { Schema, model } from "mongoose";
import { BaseCamp } from "./baseCamp.model";
import { Camper } from "./camper.model";

export interface Camp extends BaseCamp {
  baseCamp: Schema.Types.ObjectId;
  campers: (Camper | Schema.Types.ObjectId)[];
  waitlist: Schema.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  active: boolean;
}

const CampSchema: Schema = new Schema({
  baseCamp: {
    type: Schema.Types.ObjectId,
    ref: "BaseCamp",
    required: true,
  },
  campers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Camper",
      default: [],
    },
  ],
  waitlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Camper",
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
