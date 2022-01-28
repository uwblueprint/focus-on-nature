import mongoose, { Schema, Document } from "mongoose";

import { Role } from "../types";

export interface User extends Document {
  id: string; // update to string 
  firstName: string;
  lastName: string;
  authId: string; 
  email: string;
  role: Role;
  active: boolean;
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
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
    required: true,
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
