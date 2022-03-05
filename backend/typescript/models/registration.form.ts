import mongoose, { Schema, Document } from "mongoose";

export interface RegistrationForm extends Document {
  id: string;
  questions: Schema.Types.ObjectId[];
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
