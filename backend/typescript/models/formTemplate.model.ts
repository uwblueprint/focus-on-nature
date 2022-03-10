import mongoose, { Schema, Document } from "mongoose";

export interface FormTemplate extends Document {
  id: string;
  questions: Schema.Types.ObjectId[];
}

const FormTemplateSchema: Schema = new Schema({
  questions: {
    type: [
      {
        type: Schema.Types.ObjectId, 
        ref: "FormQuestion"
      },
    ],
    required: true,
  }
});

export default mongoose.model<FormTemplate>(
  "FormTemplate",
  FormTemplateSchema,
);
