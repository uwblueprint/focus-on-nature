import mongoose, { Schema, Document } from "mongoose";

export interface FormTemplate extends Document {
  id: string;
  formQuestions: Schema.Types.ObjectId[];
}

const FormTemplateSchema: Schema = new Schema({
  formQuestions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "FormQuestion",
      },
    ],
    required: true,
  },
});

export default mongoose.model<FormTemplate>("FormTemplate", FormTemplateSchema);
