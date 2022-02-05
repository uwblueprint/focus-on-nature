import mongoose, { Schema, Document } from "mongoose";

import { Role } from "../types";

export interface User extends Document {
  firstName: string;
  lastName: string;
  authId: string;
  email: string;
  role: Role;
  active: boolean;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  authId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "CampLeader"],
  },
  active: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model<User>("User", UserSchema);
