//@ts-check
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        maxlength: 100,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
});

export const UserModel = model("users", userSchema);