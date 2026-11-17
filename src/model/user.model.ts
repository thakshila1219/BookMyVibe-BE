import mongoose, { Document } from "mongoose";
import { UserDTO } from "../dto/user.dto";

interface IUser extends Omit<UserDTO, '_id'>, Document {}

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "user"],
            default: "user"
        }
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model<IUser>("User", UserSchema)

export default User