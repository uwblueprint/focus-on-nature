import { Schema, Model } from "mongoose";
import UserSchema, { User } from "./user.model";

export interface CampLeader extends User {
  campSessions: Schema.Types.ObjectId;
}

const CampLeaderModel: Model<User> = UserSchema.discriminator(
  "CampLeader",
  new Schema({
    campSessions: {
      type: [{ type: Schema.Types.ObjectId, ref: "CampSession" }],
      default: [],
    },
  }),
);

export default CampLeaderModel;