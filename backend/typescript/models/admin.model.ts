import mongoose, {Schema, Model} from "mongoose";
import UserSchema, {User} from "./user.model";

export interface Admin extends User{
}

const AdminModel: Model<Admin> = UserSchema.discriminator("Admin", new Schema({
    role: {
        //override role enum to be admin
        type:String,
        default: "Admin"
    }
}));

export default AdminModel;