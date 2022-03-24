import mongoose, { Schema, Document } from "mongoose";
import { Clause, ClauseSchema } from "./clause.model";

export interface Waiver extends Document {
  clauses: Clause[];
}

const WaiverSchema: Schema = new Schema({
  clauses: [{
    text: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
    },
  }],
});

export default mongoose.model<Waiver>("Waiver", WaiverSchema);
