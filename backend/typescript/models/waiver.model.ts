import mongoose, { Schema, Document } from "mongoose";
import clauseModel, { Clause, ClauseSchema } from "./clause.model";

export interface Waiver extends Document {
  clauses: Clause[];
}

const WaiverSchema: Schema = new Schema({
  clauses: [ClauseSchema]
});

export default mongoose.model<Waiver>("Waiver", WaiverSchema);
