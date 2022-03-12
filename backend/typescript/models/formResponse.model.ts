import mongoose, { Schema, Document } from "mongoose";
import { FormQuestion } from "./formQuestion.model";

export interface FormResponse extends Document {
  id: string;
  question: FormQuestion | Schema.Types.ObjectId;
  answer: string;
}

const FormResponseSchema: Schema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "FormQuestion",
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

export default mongoose.model<FormResponse>("FormResponse", FormResponseSchema);
