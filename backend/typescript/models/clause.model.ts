import mongoose, { Schema, Document, model } from "mongoose";

export interface Clause extends Document {
    text: string,
    required: boolean
}

export const ClauseSchema: Schema = new Schema({
    text: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
    },
  });
  
  export default model<Clause>("Clause", ClauseSchema);