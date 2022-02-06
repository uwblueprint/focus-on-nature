import { Schema, Document, model } from "mongoose";

export interface AbstractCamp extends Document {
    id: string;
    name: string;
    description: string;
    location: string;
    capacity: number;
    fee: number;
    camperInfo: string[];
    camps: Schema.Types.ObjectId[]
}

const AbstractCampSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
    },
    camperInfo: {
        type: [String],
        required: true,
    },
    camps: [{ type: Schema.Types.ObjectId, ref: 'Camp' }]
});

export default model<AbstractCamp>("AbstractCamp", AbstractCampSchema);
