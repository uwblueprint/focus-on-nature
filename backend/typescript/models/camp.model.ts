import { Schema, Document, model } from "mongoose";
import { CampSession } from "./campSession.model";
import { FormQuestion } from "./formQuestion.model";
import { User } from "./user.model";

export interface Camp extends Document {
  id: string;
  ageLower: number;
  ageUpper: number;
  campCoordinators: (User | Schema.Types.ObjectId)[];
  campCounsellors: (User | Schema.Types.ObjectId)[];
  campSessions: (Schema.Types.ObjectId | CampSession)[];
  description: string;
  earlyDropOff: string;
  fee: number;
  fileName?: string;
  formQuestions: (Schema.Types.ObjectId | FormQuestion)[];
  latePickup: string;
  location: string;
  name: string;
  productId: string;
  volunteers: string[];
}

const CampSchema: Schema = new Schema({
  ageLower: {
    type: Number,
    required: true,
  },
  ageUpper: {
    type: Number,
    required: true,
  },
  campCoordinators: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  campCounsellors: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  campSessions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "CampSession",
      },
    ],
    default: [],
  },
  description: {
    type: String,
  },
  earlyDropoff: {
    type: String,
  },
  fee: {
    type: Number,
    required: true,
  },
  fileName: {
    type: String,
  },
  formQuestions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "FormQuestion",
      },
    ],
    default: [],
    required: true,
  },
  latePickup: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
  },
  volunteers: {
    type: String,
    default: [],
  },
});

export default model<Camp>("Camp", CampSchema);
