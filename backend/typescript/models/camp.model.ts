import { Schema, Document, model } from "mongoose";
import { CampSession } from "./campSession.model";
import { FormQuestion } from "./formQuestion.model";
import { User } from "./user.model";

export interface Camp extends Document {
  id: string;
  active: boolean;
  ageLower: number;
  ageUpper: number;
  campCoordinators: (User | Schema.Types.ObjectId)[];
  campCounsellors: (User | Schema.Types.ObjectId)[];
  campSessions: (Schema.Types.ObjectId | CampSession)[];
  description: string;
  earlyDropoff: string;
  endTime: string;
  fee: number;
  fileName?: string;
  formQuestions: (Schema.Types.ObjectId | FormQuestion)[];
  latePickup: string;
  location: string;
  name: string;
  startTime: string;
  productId: string;
  dropoffProductId: string;
  pickUpProductId: string;
  volunteers: string[];
}

const CampSchema: Schema = new Schema({
  active: {
    type: Boolean,
    required: true,
  },
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
  endTime: {
    type: String,
    required: true,
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
  dropoffProductId: {
    type: String,
  },
  pickUpProductId: {
    type: String,
  },
  startTime: {
    type: String,
    required: true,
  },
  volunteers: {
    type: [
      {
        type: String,
      },
    ],
    default: [],
  },
});

export default model<Camp>("Camp", CampSchema);
