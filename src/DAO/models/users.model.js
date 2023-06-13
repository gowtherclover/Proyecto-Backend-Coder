//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const schema = new Schema({
    firstName: { type: String, required: true, max: 100, index: true },
    lastName: { type: String, required: true, max: 100 },
    email: { type: String, required: true, max: 100, unique: true },
});
schema.plugin(mongoosePaginate)
export const UserModel = model("users", schema);