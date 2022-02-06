import { Schema, model, Model } from "mongoose";
import AbstractCampSchema, { AbstractCamp } from "./abstractCamp.model";

export interface Camp extends AbstractCamp {
    campers: string[]; // TODO: make camper array
    waitlist: string[]; // TODO: make camper array
    startDate: Date;
    endDate: Date;
    active: boolean;
}

const CampSchema: Model<Camp> = AbstractCampSchema.discriminator("Camp", new Schema({
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
}));

export default CampSchema;