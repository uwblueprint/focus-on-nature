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
  dropoffFee: number;
  pickupFee: number;
  earlyDropoff: string;
  endTime: string;
  fee: number;
  fileName?: string;
  formQuestions: (Schema.Types.ObjectId | FormQuestion)[];
  latePickup: string;
  location: {
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    province: string;
    postalCode: string;
  };
  name: string;
  startTime: string;
  campProductId: string;
  dropoffPriceId: string;
  dropoffProductId: string;
  pickupPriceId: string;
  pickupProductId: string;
  volunteers: string;
  createdAt: Date;
  updatedAt: Date;
}

const CampSchema: Schema = new Schema(
  {
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
    dropoffFee: {
      type: Number,
      required: true,
    },
    pickupFee: {
      type: Number,
      required: true,
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
      streetAddress1: {
        type: String,
        required: true,
      },
      streetAddress2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    name: {
      type: String,
      required: true,
    },
    campProductId: {
      type: String,
    },
    dropoffPriceId: {
      type: String,
    },
    dropoffProductId: {
      type: String,
    },
    pickupPriceId: {
      type: String,
    },
    pickupProductId: {
      type: String,
    },
    startTime: {
      type: String,
      required: true,
    },
    volunteers: {
      type: String,
    },
  },
  { timestamps: true },
);

export default model<Camp>("Camp", CampSchema);
