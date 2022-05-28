import { Schema, Model } from "mongoose";
import UserSchema, { User } from "./user.model";

export interface CampCoordinator extends User {
  campSessions: Schema.Types.ObjectId;
}

const CampCoordinatorModel: Model<User> = UserSchema.discriminator(
  "CampCoordinator",
  new Schema({
    campSessions: {
      type: [{ type: Schema.Types.ObjectId, ref: "CampSession" }],
      default: [],
    },
  }),
);

export default CampCoordinatorModel;
