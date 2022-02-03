import mongoose, { Schema, model, Model } from "mongoose";
import UserSchema, { User } from "./user.model"; 

//import { Camp } from "../camp.model" // this feature hasn't been merged to master yet 

export interface Campleader extends User {
    camps: [{ type: mongoose.Schema.Types.ObjectId; ref: "Camp" }];
}

const CampleaderSchema: Model<User> = UserSchema.discriminator("Campleader", new Schema({
  camps: {
    type: [{ type: Schema.Types.ObjectId, ref: "Camp" }],
    default: [],
  },
});

export default CampleaderSchema;
