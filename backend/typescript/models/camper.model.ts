import mongoose, { Schema, Document } from "mongoose";

export interface Camper extends Document {
  id: string;
  campSession: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  age: number;
  allergies: string;
  earlyDropoff: Date[];
  latePickup: Date[];
  specialNeeds: string;
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationshipToCamper: string;
  }[];
  formResponses: Map<string, string>;
  registrationDate: Date;
  hasPaid: boolean;
  refundStatus: string;
  chargeId: string;
  paymentIntentId: string;
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
  earlyDropoff: [Date],
  latePickup: [Date],
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
        relationshipToCamper: {
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
  refundStatus: {
    type: String,
    required: true,
  },
  chargeId: {
    type: String,
    required: true,
  },
  paymentIntentId: {
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
  optionalClauses: [
    {
      clause: {
        type: String,
      },
      agreed: {
        type: Boolean,
      },
    },
  ],
});

export default mongoose.model<Camper>("Camper", CamperSchema);
