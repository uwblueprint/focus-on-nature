import { Schema, Model } from "mongoose";
import UserSchema, { User } from "./user.model"; 

export interface CampLeader extends User {
    camps: Schema.Types.ObjectId;
}

const CampLeaderModel: Model<User> = UserSchema.discriminator("CampLeader",
  new Schema({
    camps: {
      type: [{ type: Schema.Types.ObjectId, ref: "Camp" }],
      default: [],
    },
  })
);

export default CampLeaderModel;
