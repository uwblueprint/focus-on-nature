import mongoose, { Schema, Document } from "mongoose";

export interface Camper extends Document {
  id: string;
  campSession: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  age: number;
  allergies: string;
  hasCamera: boolean;
  hasLaptop: boolean;
  earlyDropoff: Date[];
  latePickup: Date[];
  specialNeeds: string;
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }[];
  formResponses: Map<string, string>;
  registrationDate: Date;
  hasPaid: boolean;
  chargeId: string;
  charges: {
    camp: number;
    earlyDropoff: number;
    latePickup: number;
  };
  optionalClauses: [
    {
      clause: string;
      agreed: boolean;
    },
  ];
}

const CamperSchema: Schema = new Schema({
  campSession: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CampSession",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  allergies: {
    type: String,
  },
  hasCamera: {
    type: Boolean,
  },
  hasLaptop: {
    type: Boolean,
  },
  earlyDropoff: [{ type: Date }],
  latePickup: [{ type: Date }],
  specialNeeds: {
    type: String,
  },
  contacts: {
    type: [
      {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  formResponses: {
    type: Map,
    of: String,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  hasPaid: {
    type: Boolean,
    required: true,
  },
  chargeId: {
    type: String,
    required: true,
  },
  charges: {
    camp: {
      type: Number,
      required: true,
    },
    earlyDropoff: {
      type: Number,
      required: true,
    },
    latePickup: {
      type: Number,
      required: true,
    },
  },
});

export default mongoose.model<Camper>("Camper", CamperSchema);
