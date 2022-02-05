import mongoose, { Schema, model, Model } from "mongoose";
import UserSchema, { User } from "./user.model"; 

export interface CampLeader extends User {
    camps: [{ type: mongoose.Schema.Types.ObjectId; ref: "Camp" }];
}

const CampLeaderModel: Model<User> = UserSchema.discriminator("CampLeader", new Schema({
  camps: {
    type: [{ type: Schema.Types.ObjectId, ref: "Camp" }],
    default: [],
  },
}));

export default CampLeaderModel;