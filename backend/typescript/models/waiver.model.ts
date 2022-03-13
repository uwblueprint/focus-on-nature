import mongoose, { Schema, Document } from "mongoose";

export interface Waiver extends Document {
  paragraphs: object[]
}

const WaiverSchema: Schema = new Schema({
  paragraphs: [{
    text: {type: String, required: true},
    required: {type: Boolean, required: true}
  }]
});

export default mongoose.model<Waiver>("Waiver", WaiverSchema);
