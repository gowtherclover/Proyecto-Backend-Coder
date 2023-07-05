import { connect } from "mongoose";
import { env } from "../config/env.js";

export async function connectMongo() {
    try {
        await connect(env.MONGO_URL);
        console.log("plug to mongo!");
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}