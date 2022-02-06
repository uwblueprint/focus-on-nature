import { Schema, model, Model } from "mongoose";
import AbstractCampSchema, { AbstractCamp } from "./abstractCamp";

export interface Camp extends AbstractCamp {
    baseCamp: Schema.Types.ObjectId;
    campers: string[]; // TODO: make camper array
    waitlist: string[]; // TODO: make camper array
    startDate: Date;
    endDate: Date;
    active: boolean;
}

const CampSchema: Schema = new Schema({
    camp: { type: Schema.Types.ObjectId, ref: 'C' },
    campers: {
        type: [String],
        required: true,
    }, // TODO: make camper array
    waitlist: {
        type: [String],
        required: true,
    }, // TODO: make camper array
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
    }
});

export default model<Camp>("Camp", CampSchema);
