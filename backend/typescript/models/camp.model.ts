import { Schema, model } from "mongoose";
import { AbstractCamp } from "./abstractCamp.model";
import { Camper } from "./camper.model";

export interface Camp extends AbstractCamp {
  abstractCamp: Schema.Types.ObjectId;
  campers: (Camper | Schema.Types.ObjectId)[];
  waitlist: Schema.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  active: boolean;
}

const CampSchema: Schema = new Schema({
  abstractCamp: {
    type: Schema.Types.ObjectId,
    ref: "AbstractCamp",
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
