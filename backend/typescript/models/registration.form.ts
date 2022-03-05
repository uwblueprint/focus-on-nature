import mongoose, { Schema, Document } from "mongoose";

//import { Question } from "../types";

export interface RegistrationForm extends Document {
  id: string;
  //questions: Question[];
  questions: Schema.Types.ObjectId[]
}

const RegistrationFormSchema: Schema = new Schema({
  questions: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
});

export default mongoose.model<RegistrationForm>(
  "RegistrationForm",
  RegistrationFormSchema,
);
